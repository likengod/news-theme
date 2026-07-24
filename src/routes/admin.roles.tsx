import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  loadRoles,
  saveRoles,
  getRolesServer,
  saveRolesServer,
  slugify,
  type Role,
} from "@/lib/roles";
import { RoleTable } from "@/components/admin/roles/RoleTable";
import { RoleEditorModal } from "@/components/admin/roles/RoleEditorModal";

export const Route = createFileRoute("/admin/roles")({
  component: RolesPage,
});

function emptyRole(): Role {
  return { id: "", name: "", description: "", color: "slate", seesPopupAds: true };
}

function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(() => loadRoles());
  const [editing, setEditing] = useState<Role | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local cache immediately, then sync with MySQL server roles
    getRolesServer()
      .then((serverRoles) => {
        setRoles(serverRoles);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const persist = (next: Role[]) => {
    setRoles(next);
    saveRoles(next);
    saveRolesServer({ data: next }).catch(() => {});
  };

  const openNew = () => {
    setEditing(emptyRole());
    setIsNew(true);
  };

  const openEdit = (r: Role) => {
    setEditing({ ...r });
    setIsNew(false);
  };

  const onSave = (draft: Role) => {
    const name = draft.name.trim();
    if (!name) return toast.error("Role name is required");
    const id = isNew ? slugify(name) : draft.id;
    if (!id) return toast.error("Invalid role name");
    if (isNew && roles.some((r) => r.id === id))
      return toast.error("A role with this name already exists");

    const next = isNew
      ? [...roles, { ...draft, id }]
      : roles.map((r) => (r.id === id ? { ...draft, id } : r));

    persist(next);
    toast.success(isNew ? "Role created and saved to MySQL" : "Role updated in MySQL");
    setEditing(null);
  };

  const onDelete = (r: Role) => {
    if (r.builtin) return toast.error("Built-in roles cannot be deleted");
    if (!confirm(`Are you sure you want to delete role "${r.name}"?`)) return;
    const next = roles.filter((x) => x.id !== r.id);
    persist(next);
    toast.success("Role deleted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Roles</h1>
          <p className="text-sm text-slate-500">
            Create, edit and delete roles available in the Users screen. Syncs to MySQL.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> New role
        </button>
      </div>

      {/* Role Table */}
      <RoleTable roles={roles} onEdit={openEdit} onDelete={onDelete} />

      {/* Role Editor Modal */}
      {editing && (
        <RoleEditorModal
          role={editing}
          isNew={isNew}
          onClose={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
