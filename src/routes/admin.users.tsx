import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient as supabase } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { toast } from "sonner";
import { loadRoles, getRolesServer, type Role } from "@/lib/roles";
import {
  listAdminUsers,
  createAdminUser,
  setAdminUserRole,
  deleteAdminUser,
  toggleAdminUserBan,
  bulkDeleteAdminUsers,
  bulkToggleAdminUserBan,
  regeneratePublicUserId,
  setUserPoints,
  updateAdminUserPassword,
  updateAdminUserDetails,
  getAllAdminUsers,
  importAdminUsers,
  type AdminUserRow,
} from "@/lib/admin-users.functions";
import { UserFilterBar } from "@/components/admin/users/UserFilterBar";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserActionModal } from "@/components/admin/users/UserActionModal";
import { CreateUserModal } from "@/components/admin/users/CreateUserModal";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type AppRole = AdminUserRow["role"];
type SortMode = "recent" | "points_desc" | "points_asc" | "name";
type ModalKind = null | "points" | "password" | "details";

function UsersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminUsers);
  const createFn = useServerFn(createAdminUser);
  const setRoleFn = useServerFn(setAdminUserRole);
  const delFn = useServerFn(deleteAdminUser);
  const banFn = useServerFn(toggleAdminUserBan);
  const bulkDelFn = useServerFn(bulkDeleteAdminUsers);
  const bulkBanFn = useServerFn(bulkToggleAdminUserBan);
  const regenFn = useServerFn(regeneratePublicUserId);
  const pointsFn = useServerFn(setUserPoints);
  const passFn = useServerFn(updateAdminUserPassword);
  const detailsFn = useServerFn(updateAdminUserDetails);
  const getAllFn = useServerFn(getAllAdminUsers);
  const importFn = useServerFn(importAdminUsers);

  const [roles, setRoles] = useState<Role[]>(() => loadRoles());
  useEffect(() => {
    getRolesServer()
      .then((res) => setRoles(res))
      .catch(() => {});
  }, []);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AppRole>("all");
  const [sort, setSort] = useState<SortMode>("recent");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 20;

  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUserRow[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);

  const usersQuery = useQuery({
    queryKey: ["admin-users", q, roleFilter, sort, page],
    queryFn: () => listFn({ data: { q, role: roleFilter, sort, page, limit } }),
  });

  const rows = useMemo(() => usersQuery.data?.rows ?? [], [usersQuery.data]);

  // Load all users for export
  useEffect(() => {
    getAllFn().then(res => setAllUsers(res)).catch(console.error);
  }, [rows]);

  const handleImport = async (data: any[]) => {
    try {
      await importFn({ data });
      toast.success("Users imported successfully");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      const all = await getAllFn();
      setAllUsers(all);
    } catch (err: any) {
      toast.error(err.message || "Failed to import users");
    }
  };

  const handleToggleSelect = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleToggleSelectAll = () => {
    const selectableIds = rows.filter((u) => u.id !== currentUserId).map((u) => u.id);
    const allSelected =
      selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !selectableIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selectableIds])));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected user(s)?`)) return;
    try {
      const res = await bulkDelFn({ data: { userIds: selectedIds } });
      toast.success(`Successfully deleted ${res.deletedCount} user(s)`);
      setSelectedIds([]);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed bulk delete");
    }
  };

  const handleBulkStatusChange = async (suspend: boolean) => {
    if (selectedIds.length === 0) return;
    const actionText = suspend ? "suspended" : "activated";
    try {
      const res = await bulkBanFn({ data: { userIds: selectedIds, suspend } });
      toast.success(`Successfully ${actionText} ${res.updatedCount} user(s)`);
      setSelectedIds([]);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed bulk status update");
    }
  };

  useEffect(() => {
    if (usersQuery.isError && (usersQuery.error as Error)?.message?.includes("Unauthorized")) {
      supabase.auth.signOut().then(() => {
        navigate({ to: "/auth" });
      });
    }
  }, [usersQuery.isError, usersQuery.error]);

  const [showCreate, setShowCreate] = useState(false);
  const [modal, setModal] = useState<{ kind: ModalKind; row: AdminUserRow | null }>({
    kind: null,
    row: null,
  });

  const handleCreate = async (email: string, pass: string, name: string, role: AppRole) => {
    try {
      await createFn({ data: { email, password: pass, displayName: name, role } });
      toast.success(`User ${email} created successfully`);
      setShowCreate(false);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to create user");
    }
  };

  const handleSetRole = async (userId: string, role: AppRole) => {
    try {
      await setRoleFn({ data: { userId, role } });
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to update role");
    }
  };

  const handleToggleBan = async (row: AdminUserRow) => {
    const next = row.status === "Active" ? "Suspended" : "Active";
    try {
      await banFn({ data: { userId: row.id, suspended: next === "Suspended" } });
      toast.success(`User is now ${next}`);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to toggle user status");
    }
  };

  const handleDelete = async (row: AdminUserRow) => {
    if (!confirm(`Are you sure you want to permanently delete ${row.email}?`)) return;
    try {
      await delFn({ data: row.id });
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to delete user");
    }
  };

  const handleRegenId = async (row: AdminUserRow) => {
    try {
      const res = await regenFn({ data: row.id });
      toast.success(`New Public ID generated: ${res.publicUserId}`);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to regenerate public ID");
    }
  };

  const handleSavePoints = async (userId: string, points: number) => {
    try {
      await pointsFn({ data: { userId, points } });
      toast.success("Points updated");
      setModal({ kind: null, row: null });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to update points");
    }
  };

  const handleSavePassword = async (userId: string, pass: string) => {
    try {
      await passFn({ data: { userId, password: pass } });
      toast.success("Password updated successfully");
      setModal({ kind: null, row: null });
    } catch (e: any) {
      toast.error(e.message || "Failed to update password");
    }
  };

  const handleSaveDetails = async (userId: string, name: string, avatar: string) => {
    try {
      await detailsFn({ data: { userId, displayName: name, avatarUrl: avatar } });
      toast.success("Profile details updated");
      setModal({ kind: null, row: null });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to update details");
    }
  };

  const total = usersQuery.data?.total ?? 0;
  const totalPages = usersQuery.data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-sm text-slate-500">
            Server-paginated list of registered users, roles, public IDs, and points.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportExport
            data={allUsers}
            filename="users"
            onImport={handleImport}
          />
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
            <Users className="h-4 w-4" /> Total Users: {total}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        q={q}
        onSearchChange={(val) => {
          setQ(val);
          setPage(1);
        }}
        roleFilter={roleFilter}
        onRoleFilterChange={(val) => {
          setRoleFilter(val);
          setPage(1);
        }}
        sort={sort}
        onSortChange={(val) => {
          setSort(val);
          setPage(1);
        }}
        roles={roles}
        onCreateClick={() => setShowCreate(true)}
      />

      {/* Users Table */}
      {usersQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
        </div>
      ) : (
        <UserTable
          users={rows}
          currentUserId={currentUserId}
          roles={roles}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onClearSelection={() => setSelectedIds([])}
          onSetRole={handleSetRole}
          onToggleBan={handleToggleBan}
          onDelete={handleDelete}
          onRegenId={handleRegenId}
          onOpenModal={(kind, row) => setModal({ kind, row })}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total users)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Modals */}
      {modal.kind && modal.row && (
        <UserActionModal
          kind={modal.kind}
          row={modal.row}
          onClose={() => setModal({ kind: null, row: null })}
          onSavePoints={handleSavePoints}
          onSavePassword={handleSavePassword}
          onSaveDetails={handleSaveDetails}
        />
      )}

      {showCreate && (
        <CreateUserModal
          roles={roles}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
