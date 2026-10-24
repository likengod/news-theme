import { useState, useEffect, useRef, FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Newspaper,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { authClient } from "@/lib/auth-client";
import {
  submitJournalistApplication,
  getMyJournalistApplicationStatus,
} from "@/lib/inbox.functions";

import { PersonalInfoStep } from "@/components/journalist-application/PersonalInfoStep";
import { IdVerificationStep } from "@/components/journalist-application/IdVerificationStep";
import { AvatarStep } from "@/components/journalist-application/AvatarStep";
import { AddressStep } from "@/components/journalist-application/AddressStep";

export const Route = createFileRoute("/apply-journalist")({
  head: () => ({
    meta: [
      { title: "Apply as Journalist — Today Tripura" },
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

  // Accreditation & Existing Application State
  const [isJournalist, setIsJournalist] = useState(false);
  const [journalistId, setJournalistId] = useState<string | null>(null);
  const [validTill, setValidTill] = useState<string | null>(null);
  const [existingApp, setExistingApp] = useState<any | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
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
    let isMounted = true;
    authClient.auth
      .getSession()
      .then(async ({ data }) => {
        if (!isMounted) return;
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

          // Fetch user profile and application status
          try {
            const status = await getMyJournalistApplicationStatus();
            if (!isMounted) return;
            if (status) {
              if (status.isJournalist) {
                setIsJournalist(true);
                setJournalistId(status.journalistId);
                setValidTill(status.validTill);
              }
              if (status.application) {
                setExistingApp(status.application);
              }

              // Pre-fill form from profile or existing application details
              const p = status.profile || {};
              const d = status.application?.details || {};

              if (p.displayName || d.displayName) setDisplayName(p.displayName || d.displayName);
              if (p.email || d.email) setEmail(p.email || d.email);
              if (p.phone || d.phone) setPhone(p.phone || d.phone);
              if (p.dob || d.dob) setDob(p.dob || d.dob);
              if (p.bloodGroup || d.bloodGroup) setBloodGroup(p.bloodGroup || d.bloodGroup);
              if (p.fatherName || d.fatherName) setFatherName(p.fatherName || d.fatherName);
              if (p.motherName || d.motherName) setMotherName(p.motherName || d.motherName);
              if (p.gender || d.gender) setGender(p.gender || d.gender);
              if (p.maritalStatus || d.maritalStatus) setMaritalStatus(p.maritalStatus || d.maritalStatus);
              if (p.husbandName || d.husbandName) setHusbandName(p.husbandName || d.husbandName);
              if (p.documentType || d.documentType) setDocumentType(p.documentType || d.documentType);
              if (p.documentUrl || d.documentUrl) setDocumentUrl(p.documentUrl || d.documentUrl);
              if (p.avatarUrl || d.avatarUrl) setAvatarUrl(p.avatarUrl || d.avatarUrl);
              if (p.address || d.address) setAddress(p.address || d.address);
              if (p.state || d.state) setState(p.state || d.state);
              if (p.country || d.country) setCountry(p.country || d.country || "India");
              if (p.pinCode || d.pinCode) setPinCode(p.pinCode || d.pinCode);
            }
          } catch (e) {
            console.warn("Could not prefill journalist application status:", e);
          }
        }
      })
      .finally(() => {
        if (isMounted) setAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Document file must be smaller than 5 MB.");
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
      toast.error(`Please upload your ${documentType} image (under 5 MB).`);
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
          dob: dob.trim(),
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <Header />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
        {/* Top Header Card */}
        <div className="mb-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:border-b sm:border-slate-200 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 mb-2.5">
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
          /* Submission Confirmation */
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-xs">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
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
        ) : isJournalist ? (
          /* User is ALREADY an accredited journalist */
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <span className="mt-4 inline-block rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Accredited Press Member
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              You are an Accredited Journalist
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 leading-relaxed">
              Your credentials have been verified and your official press accreditation is currently active.
            </p>
            <div className="mt-5 inline-flex items-center gap-6 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm">
              <div>
                <span className="block text-[11px] font-semibold uppercase text-slate-400">Press ID</span>
                <span className="font-mono font-bold text-slate-900 text-base">{journalistId || "Verified"}</span>
              </div>
              {validTill && (
                <div className="border-l border-slate-200 pl-6">
                  <span className="block text-[11px] font-semibold uppercase text-slate-400">Valid Till</span>
                  <span className="font-medium text-slate-700">{validTill}</span>
                </div>
              )}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {journalistId && (
                <Link
                  to="/verified-journalist"
                  search={{ id: journalistId }}
                  className="rounded-lg bg-emerald-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  View Press ID Card
                </Link>
              )}
              <Link
                to="/admin"
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Go to Newsroom
              </Link>
            </div>
          </div>
        ) : (
          /* Logged In Application Form (No Card Effect) */
          <div>
            {/* Identity Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-3 mb-6">
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

            {/* Application Status Banner if already applied */}
            {existingApp?.status === "Pending" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3.5 mb-6 flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-100 p-1 text-amber-700 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Application Under Editorial Review
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Your journalist accreditation application is currently being reviewed by our newsroom editors. You can update any information and re-submit below anytime.
                  </p>
                </div>
              </div>
            )}

            {existingApp?.status === "Rejected" && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3.5 mb-6 flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-rose-100 p-1 text-rose-700 shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-900">
                    Previous Application Was Not Approved
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                    Please review your documents, fill in any missing details, and submit a revised application.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <PersonalInfoStep
                displayName={displayName}
                setDisplayName={setDisplayName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                dob={dob}
                setDob={setDob}
                fatherName={fatherName}
                setFatherName={setFatherName}
                motherName={motherName}
                setMotherName={setMotherName}
                gender={gender}
                setGender={setGender}
                maritalStatus={maritalStatus}
                setMaritalStatus={setMaritalStatus}
                husbandName={husbandName}
                setHusbandName={setHusbandName}
                bloodGroup={bloodGroup}
                setBloodGroup={setBloodGroup}
              />

              <IdVerificationStep
                documentType={documentType}
                setDocumentType={setDocumentType}
                documentUrl={documentUrl}
                docFileInputRef={docFileInputRef}
                handleDocumentFile={handleDocumentFile}
                clearDocument={clearDocument}
              />

              <AvatarStep
                avatarUrl={avatarUrl}
                fileInputRef={fileInputRef}
                handleAvatarFile={handleAvatarFile}
                clearAvatar={clearAvatar}
              />

              <AddressStep
                address={address}
                setAddress={setAddress}
                state={state}
                setState={setState}
                country={country}
                setCountry={setCountry}
                pinCode={pinCode}
                setPinCode={setPinCode}
              />

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
                      <span>{existingApp?.status === "Pending" ? "Update Application" : "Submit Application"}</span>
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
