import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Database, User, Check, Server, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { testDatabaseConnection, executeSetup } from "@/lib/setup.functions";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup Wizard – News Theme" },
      { name: "description", content: "Configure your database and administrator account." },
    ],
  }),
  component: SetupWizardPage,
});

function SetupWizardPage() {
  const testConnFn = useServerFn(testDatabaseConnection);
  const execSetupFn = useServerFn(executeSetup);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [testing, setTesting] = useState(false);
  const [installing, setInstalling] = useState(false);

  const [showDbPwd, setShowDbPwd] = useState(false);
  const [showAdminPwd, setShowAdminPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Step 1: Database configuration
  const [dbConfig, setDbConfig] = useState({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "today_tripura",
  });

  // Step 2: Admin credentials
  const [adminConfig, setAdminConfig] = useState({
    displayName: "Admin",
    email: "admin@demo.com",
    password: "",
    confirmPassword: "",
  });

  const handleDbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbConfig({ ...dbConfig, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminConfig({ ...adminConfig, [e.target.name]: e.target.value });
  };

  const handleTestConnection = async () => {
    if (!dbConfig.host || !dbConfig.port || !dbConfig.user || !dbConfig.database) {
      return toast.error("All database fields except password are required");
    }

    setTesting(true);
    try {
      const res = await testConnFn({ data: dbConfig });
      if (res.success) {
        toast.success("Database connected and verified successfully!");
        setStep(2);
      } else {
        toast.error(res.error || "Connection failed. Double check credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to query database server");
    } finally {
      setTesting(false);
    }
  };

  const handleRunSetup = async () => {
    if (!adminConfig.displayName || !adminConfig.email || !adminConfig.password) {
      return toast.error("All administrator fields are required");
    }
    if (adminConfig.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    if (adminConfig.password !== adminConfig.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setInstalling(true);
    try {
      const res = await execSetupFn({
        data: {
          dbConfig,
          adminConfig,
        },
      });

      if (res.success) {
        toast.success("System installed successfully! Please log in.");
        // Short timeout to let the session system settle before redirecting
        setTimeout(() => {
          window.location.assign("/auth");
        }, 1500);
      } else {
        toast.error(res.error || "Setup failed. Check database server.");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected setup error");
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-white">News Theme</h1>
        <p className="mt-2 text-sm text-slate-400">Installation & Setup Wizard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-800 py-8 px-4 shadow-xl rounded-lg border border-slate-700 sm:px-10">
          
          {/* Progress Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= 1 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`}>
                  {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="ml-2 text-sm font-medium text-slate-300">Database</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-700 mx-4" />
              <div className="flex items-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= 2 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`}>
                  {step > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="ml-2 text-sm font-medium text-slate-300">Admin Account</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-700 mx-4" />
              <div className="flex items-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= 3 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-slate-300">Install</span>
              </div>
            </div>
          </div>

          {/* Step 1: Database Setup */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-amber-500" /> Connect Database
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Input connection credentials for your MySQL instance. If the database does not exist, we will try to create it.
                </p>
              </div>

              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">MySQL Host</label>
                  <input
                    name="host"
                    value={dbConfig.host}
                    onChange={handleDbChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Port</label>
                  <input
                    name="port"
                    value={dbConfig.port}
                    onChange={handleDbChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="col-span-6 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Database User</label>
                  <input
                    name="user"
                    value={dbConfig.user}
                    onChange={handleDbChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="col-span-6 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Database Password</label>
                  <div className="relative">
                    <input
                      type={showDbPwd ? "text" : "password"}
                      name="password"
                      value={dbConfig.password}
                      onChange={handleDbChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDbPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle database password visibility"
                    >
                      {showDbPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="col-span-6 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Database Name</label>
                  <input
                    name="database"
                    value={dbConfig.database}
                    onChange={handleDbChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying Connection &amp; Database...
                    </>
                  ) : (
                    <>
                      <Server className="h-4 w-4" /> Next: Test Connection &amp; Proceed
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Admin credentials */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-500" /> Administrator Account
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Configure details for the master administrator login account.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name / Display Name</label>
                  <input
                    name="displayName"
                    value={adminConfig.displayName}
                    onChange={handleAdminChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={adminConfig.email}
                    onChange={handleAdminChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showAdminPwd ? "text" : "password"}
                      name="password"
                      value={adminConfig.password}
                      onChange={handleAdminChange}
                      placeholder="Min. 8 characters"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle administrator password visibility"
                    >
                      {showAdminPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      name="confirmPassword"
                      value={adminConfig.confirmPassword}
                      onChange={handleAdminChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle administrator confirm password visibility"
                    >
                      {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-md border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!adminConfig.displayName || !adminConfig.email || !adminConfig.password) {
                      return toast.error("All administrator fields are required");
                    }
                    if (adminConfig.password.length < 8) {
                      return toast.error("Password must be at least 8 characters");
                    }
                    if (adminConfig.password !== adminConfig.confirmPassword) {
                      return toast.error("Passwords do not match");
                    }
                    setStep(3);
                  }}
                  className="w-2/3 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  Next: Review Setup
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete Installation */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" /> Review &amp; Install
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Ready to apply settings, generate database tables, and insert user credentials.
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-md border border-slate-700 text-xs space-y-3">
                <div>
                  <span className="font-bold block text-slate-400">MySQL Connection:</span>
                  <span className="font-mono">{dbConfig.user}@{dbConfig.host}:{dbConfig.port}/{dbConfig.database}</span>
                </div>
                <div>
                  <span className="font-bold block text-slate-400">Admin Email:</span>
                  <span className="font-mono">{adminConfig.email}</span>
                </div>
                <div>
                  <span className="font-bold block text-slate-400">Admin Name:</span>
                  <span>{adminConfig.displayName}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={installing}
                  className="w-1/3 rounded-md border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleRunSetup}
                  disabled={installing}
                  className="w-2/3 inline-flex justify-center items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50"
                >
                  {installing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Installing...
                    </>
                  ) : (
                    "Execute & Complete Installation"
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
