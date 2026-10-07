import { MapPin } from "lucide-react";

interface AddressStepProps {
  address: string;
  setAddress: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  pinCode: string;
  setPinCode: (val: string) => void;
}

export function AddressStep({
  address,
  setAddress,
  state,
  setState,
  country,
  setCountry,
  pinCode,
  setPinCode,
}: AddressStepProps) {
  return (
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
  );
}
