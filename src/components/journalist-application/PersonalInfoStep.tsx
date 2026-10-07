import { User } from "lucide-react";

interface PersonalInfoStepProps {
  displayName: string;
  setDisplayName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  fatherName: string;
  setFatherName: (val: string) => void;
  motherName: string;
  setMotherName: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  maritalStatus: string;
  setMaritalStatus: (val: string) => void;
  husbandName: string;
  setHusbandName: (val: string) => void;
  bloodGroup: string;
  setBloodGroup: (val: string) => void;
}

export function PersonalInfoStep({
  displayName,
  setDisplayName,
  email,
  setEmail,
  phone,
  setPhone,
  fatherName,
  setFatherName,
  motherName,
  setMotherName,
  gender,
  setGender,
  maritalStatus,
  setMaritalStatus,
  husbandName,
  setHusbandName,
  bloodGroup,
  setBloodGroup,
}: PersonalInfoStepProps) {
  return (
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
  );
}
