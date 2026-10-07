import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { UserFilterBar } from "@/components/admin/users/UserFilterBar";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserActionModal } from "@/components/admin/users/UserActionModal";
import { CreateUserModal } from "@/components/admin/users/CreateUserModal";
import { CsvImportExport } from "@/components/admin/CsvImportExport";
import { useAdminUsers } from "@/components/admin/users/useAdminUsers";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const siteSettings = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(siteSettings);

  const {
    roles,
    q,
    setQ,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    effectiveSort,
    setSort,
    selectedIds,
    setSelectedIds,
    currentUserId,
    allUsers,
    rows,
    usersQuery,
    total,
    totalPages,
    showCreate,
    setShowCreate,
    modal,
    setModal,
    handleImport,
    handleToggleSelect,
    handleToggleSelectAll,
    handleBulkDelete,
    handleBulkStatusChange,
    handleCreate,
    handleSetRole,
    handleToggleBan,
    handleDelete,
    handleRegenId,
    handleSavePoints,
    handleSavePassword,
    handleSaveDetails,
  } = useAdminUsers(isEnterprisePlus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isEnterprisePlus
              ? "Server-paginated list of registered users, roles, public IDs, and points."
              : "Server-paginated list of registered users, roles, and public IDs."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <CsvImportExport data={rows} getData={async () => allUsers} filename="users" onImport={handleImport} />
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-slate-100 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 whitespace-nowrap">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Total Users: {total}
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
        sort={effectiveSort}
        onSortChange={(val) => {
          setSort(val);
          setPage(1);
        }}
        roles={roles}
        onCreateClick={() => setShowCreate(true)}
        isEnterprisePlus={isEnterprisePlus}
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
          onOpenModal={(kind, row) => {
            if (kind === "points" && !isEnterprisePlus) return;
            setModal({ kind, row });
          }}
          isEnterprisePlus={isEnterprisePlus}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total
            users)
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
