import { useState, useEffect, useRef, FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Newspaper,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  X,
  Loader2,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { authClient } from "@/lib/auth-client";
import { submitJournalistApplication } from "@/lib/inbox.functions";

export const Route = createFileRoute("/apply-journalist")({
  head: () => ({
    meta: [
      { title: "Apply as Journalist — News Theme" },
      {
        name: "description",
        content:
          "Submit your official journalist verification application to join our press newsroom.",
      },
    ],
  }),
  component: ApplyJournalistPage,
});

function ApplyJournalistPage() {
  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [husbandName, setHusbandName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [pinCode, setPinCode] = useState("");

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    authClient.auth
      .getSession()
      .then(({ data }) => {
        if (data.session?.user) {
          const u = data.session.user;
          setUserId(u.id);
          const userMail = u.email || "";
          setUserEmail(userMail);
          setEmail(userMail);

          const dName =
            u.user_metadata?.display_name ||
            u.user_metadata?.full_name ||
            userMail.split("@")[0] ||
            "";
          setUserDisplayName(dName);
          setDisplayName(dName);
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleAvatarFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDocumentFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Document image must be less than 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDocumentUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const clearDocument = () => {
    setDocumentUrl("");
    if (docFileInputRef.current) docFileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Valid email is required.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Contact phone number is required.");
      return;
    }
    if (gender === "Female" && maritalStatus === "Married" && !husbandName.trim()) {
      toast.error("Husband's name is required for married female applicants.");
      return;
    }
    if (documentType && !documentUrl) {
      toast.error(`Please upload your ${documentType} image (under 1 MB).`);
      return;
    }
    if (documentUrl && !documentType) {
      toast.error("Please select which document type you provided.");
      return;
    }

    setSubmitting(true);
    try {
      await submitJournalistApplication({
        data: {
          displayName: displayName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          bloodGroup: bloodGroup.trim(),
          fatherName: fatherName.trim(),
          motherName: motherName.trim(),
          gender: gender.trim(),
          maritalStatus: maritalStatus.trim(),
          husbandName: gender === "Female" && maritalStatus === "Married" ? husbandName.trim() : "",
          documentType: documentType.trim(),
          documentUrl: documentUrl.trim(),
          avatarUrl,
          address: address.trim(),
          state: state.trim(),
          country: country.trim(),
          pinCode: pinCode.trim(),
          bio: "",
        },
      });

      setSubmitted(true);
      toast.success("Application submitted successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Header />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        {/* Top Header Card */}
        <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:border-b sm:border-slate-200 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Newsroom Accreditation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Journalist Verification & Accreditation Form
            </h1>
          </div>
        </div>

        {authLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <p className="mt-3 text-xs text-slate-400">Verifying session...</p>
          </div>
        ) : submitted ? (
          /* Submission Confirmation Card */
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-900">Application Submitted!</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 leading-relaxed">
              Thank you, <strong>{displayName}</strong>. Your journalist verification application
              has been recorded and sent directly to our editorial inbox. Once approved by our
              administrators, your account will be granted official Journalist status and press
              card credentials.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="rounded-lg bg-slate-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Return to Homepage
              </Link>
              <Link
                to="/profile"
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                View Your Profile
              </Link>
            </div>
          </div>
        ) : !userId ? (
          /* User is NOT logged in */
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Please Sign In to Access This Form
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
              You must be signed in with your user account so your journalist credentials and
              approved status can be linked directly to your profile.
            </p>
            <div className="mt-6">
              <Link
                to="/auth"
                search={{ redirect: "/apply-journalist" }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-95"
              >
                <span>Sign In or Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Logged In Application Form */
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Identity Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>
                  Logged in as: <strong>{userDisplayName || "User"}</strong> ({userEmail})
                </span>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Account Active
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>1. Personal Information</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Kiran Nath"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="journalist@example.com"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9436121106"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Father's full name"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Mother's full name"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => {
                        const g = e.target.value;
                        setGender(g);
                        if (g !== "Female") setHusbandName("");
                      }}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Marital Status
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => {
                        const s = e.target.value;
                        setMaritalStatus(s);
                        if (s !== "Married") setHusbandName("");
                      }}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    >
                      <option value="">Select Marital Status</option>
                      <option value="Single">Single / Unmarried</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {gender === "Female" && maritalStatus === "Married" && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Husband's Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={husbandName}
                        onChange={(e) => setHusbandName(e.target.value)}
                        placeholder="Husband's full name"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Document Verification Section */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>2. Identity Document Verification</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Which document you can provide? <span className="text-slate-400 font-normal">(Select one)</span>
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    >
                      <option value="">Select Valid Document</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Choose any valid government-issued document for official verification.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Upload Document Image <span className="text-slate-400 font-normal">(&lt; 1 MB)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => docFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5 text-slate-500" />
                        <span>{documentUrl ? "Change Document" : "Upload Document"}</span>
                      </button>
                      {documentUrl && (
                        <button
                          type="button"
                          onClick={clearDocument}
                          className="text-xs font-medium text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Upload image size less than 1 MB (JPG, PNG, WEBP).
                    </p>
                    <input
                      ref={docFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDocumentFile(e.target.files?.[0])}
                    />
                  </div>
                </div>

                {documentUrl && (
                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                    <img
                      src={documentUrl}
                      alt="Document Preview"
                      className="h-20 w-32 object-contain rounded-lg border border-slate-200 bg-white shrink-0 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {documentType || "ID Document"}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600">✓ Ready to submit (&lt; 1 MB)</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {documentType ? `${documentType} image loaded.` : "Document image loaded."} Official accreditation proof.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar Upload */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>3. Profile Photo / Press Avatar</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Preview Box */}
                  <div className="h-28 w-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {avatarUrl ? (
                      <>
                        <img
                          src={avatarUrl}
                          alt="Avatar Preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearAvatar}
                          className="absolute right-1 top-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm transition"
                          title="Remove photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <ImageIcon className="h-7 w-7 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px]">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-slate-600">
                      Upload a clear, passport-style square photo (400×400 px recommended). This
                      will be printed on your digital Press ID card upon accreditation.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5 text-slate-500" />
                        <span>{avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={clearAvatar}
                          className="text-xs font-medium text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Address & Location */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>4. Address & Jurisdiction</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Radhanagar Road, Agartala"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Tripura"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pin / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="e.g. 799006"
                      className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>


              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3.5">
                <p className="text-[11.5px] sm:text-xs text-slate-400 text-center sm:text-left">
                  By submitting, you certify that all information is accurate.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white whitespace-nowrap shadow-sm hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer active:scale-95 shrink-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
