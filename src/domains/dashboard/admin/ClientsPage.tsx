import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import ClientDetailModal from "../components/ClientDetailModal";
import { adminApi, ApiError, type ClientResponse } from "../../../lib/api";
import { useClients } from "../../../lib/useClients";

type Filter = ClientResponse["status"] | "ALL";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "APPROVED", label: "Approved" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  APPROVED: "bg-blue-50 text-blue-600 border-blue-100",
  ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
  SUSPENDED: "bg-red-50 text-red-600 border-red-100",
  REJECTED: "bg-gray-100 text-gray-500 border-gray-200",
  INACTIVE: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ClientsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // The hook loads every client once and filters in memory, so switching tabs is instant.
  const filterArg = filter === "ALL" ? undefined : filter;
  const { clients, status, error, refetch } = useClients(filterArg);

  const run = async (action: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await action();
      await refetch();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `${err.message} (${err.status})`
          : err instanceof Error
            ? err.message
            : "The action failed";
      setActionError(message);
      // The modal keeps itself open when the caller throws, so the admin can retry.
      throw err;
    }
  };

  const approve = (clientId: string, roles: string[]) =>
    run(() => adminApi.approveClient(clientId, roles));

  const reject = (clientId: string) =>
    run(() => adminApi.rejectClient(clientId));

  const suspend = (clientId: string) =>
    run(() => adminApi.suspendClient(clientId));

  const activate = (clientId: string, roles: string[]) =>
    run(() => adminApi.activateClient(clientId, roles));

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-20 p-6">
        <TopNav portal="admin" />

        <div className="mb-6 mt-20">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review onboarding applications and manage the lifecycle of every
            registered company
          </p>
        </div>

        {actionError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="flex-1 text-sm text-red-600">{actionError}</p>
            <button
              onClick={() => setActionError(null)}
              className="text-red-400 hover:text-red-600"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                filter === f.value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">
              {FILTERS.find((f) => f.value === filter)?.label} clients
            </h2>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              {status === "success" ? clients.length : "—"}
            </span>
          </div>

          {status === "loading" && (
            <div className="py-10 text-center text-sm text-gray-400">
              Loading clients…
            </div>
          )}

          {status === "error" && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-500 mb-3">
                {error || "Failed to load clients"}
              </p>
              <button
                onClick={() => void refetch()}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {status === "success" && clients.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No clients in this view.
            </div>
          )}

          {status === "success" && clients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedId(client.id)}
                  className="text-left p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {client.companyName
                          .split(" ")
                          .map((w) => w[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {client.companyName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {client.contactEmail}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold flex-shrink-0 ${
                        STATUS_STYLES[client.status] ?? STATUS_STYLES.INACTIVE
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
                    {client.country && <span>{client.country}</span>}
                    {client.industry && <span>{client.industry}</span>}
                    {client.createdAt && (
                      <span>Registered {formatDate(client.createdAt)}</span>
                    )}
                    <span className="ml-auto text-gray-500 font-medium">
                      Manage →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedId && (
        <ClientDetailModal
          clientId={selectedId}
          onClose={() => setSelectedId(null)}
          onApprove={approve}
          onReject={reject}
          onSuspend={suspend}
          onActivate={activate}
        />
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
