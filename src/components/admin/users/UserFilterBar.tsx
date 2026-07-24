import { Search, Plus } from "lucide-react";
import { type Role } from "@/lib/roles";

type Props = {
  q: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: any) => void;
  sort: string;
  onSortChange: (val: any) => void;
  roles: Role[];
  onCreateClick: () => void;
};

export function UserFilterBar({
  q,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  sort,
  onSortChange,
  roles,
  onCreateClick,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search email, name or ID..."
            className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none"
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none"
        >
          <option value="recent">Recently Added</option>
          <option value="points_desc">Highest Points</option>
          <option value="points_asc">Lowest Points</option>
          <option value="name">Name / Email (A–Z)</option>
        </select>
      </div>

      {/* Action button */}
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" /> Create User
      </button>
    </div>
  );
}
