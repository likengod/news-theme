import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { testDatabaseConnection, executeSetup } from "@/lib/setup.functions";
import { SetupStepIndicator } from "@/components/setup/SetupStepIndicator";
import { SetupDatabaseStep } from "@/components/setup/SetupDatabaseStep";
import { SetupAdminStep } from "@/components/setup/SetupAdminStep";
import { SetupReviewStep } from "@/components/setup/SetupReviewStep";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup Wizard – News Theme" },
      { name: "description", content: "Configure your database and administrator account." },
    ],
  }),
  component: SetupWizardPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-lg border border-red-500/30">
        <h2 className="text-red-400 font-bold text-lg mb-2">Setup Wizard Error</h2>
        <p className="text-xs text-slate-300 font-mono break-all">
          {error?.message || String(error)}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-slate-900 rounded font-semibold text-xs hover:bg-amber-400"
        >
          Reload Page
        </button>
      </div>
    </div>
  ),
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
    host: "127.0.0.1",
    port: "3306",
    user: "vanguardtripura",
    password: "",
    database: "vanguarddb",
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
        <p className="mt-2 text-sm text-slate-400">Installation &amp; Setup Wizard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-800 py-8 px-4 shadow-xl rounded-lg border border-slate-700 sm:px-10">
          <SetupStepIndicator step={step} />

          {step === 1 && (
            <SetupDatabaseStep
              dbConfig={dbConfig}
              handleDbChange={handleDbChange}
              showDbPwd={showDbPwd}
              setShowDbPwd={setShowDbPwd}
              testing={testing}
              handleTestConnection={handleTestConnection}
            />
          )}

          {step === 2 && (
            <SetupAdminStep
              adminConfig={adminConfig}
              handleAdminChange={handleAdminChange}
              showAdminPwd={showAdminPwd}
              setShowAdminPwd={setShowAdminPwd}
              showConfirmPwd={showConfirmPwd}
              setShowConfirmPwd={setShowConfirmPwd}
              onBack={() => setStep(1)}
              onNext={() => {
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
            />
          )}

          {step === 3 && (
            <SetupReviewStep
              dbConfig={dbConfig}
              adminConfig={adminConfig}
              installing={installing}
              onBack={() => setStep(2)}
              onRunSetup={handleRunSetup}
            />
          )}
        </div>
      </div>
    </div>
  );
}
