export const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  author: "Senior Journalist",
  journalist: "Journalist",
  premium: "Premium Member",
  reader: "Reader",
};

export const ROLE_COLOR: Record<string, string> = {
  admin: "bg-red-100 text-red-700 ring-red-200",
  editor: "bg-purple-100 text-purple-700 ring-purple-200",
  author: "bg-sky-100 text-sky-700 ring-sky-200",
  journalist: "bg-blue-100 text-blue-700 ring-blue-200",
  premium: "bg-amber-100 text-amber-700 ring-amber-200",
  reader: "bg-slate-100 text-slate-600 ring-slate-200",
};

export const RANK_COLOR: Record<string, string> = {
  bronze: "text-amber-700 bg-amber-50 ring-amber-200",
  silver: "text-slate-600 bg-slate-100 ring-slate-200",
  gold: "text-yellow-700 bg-yellow-50 ring-yellow-200",
  diamond: "text-sky-700 bg-sky-50 ring-sky-200",
};
