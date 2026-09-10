import { useState } from "react";
import { usePendingClients } from "../../../lib/useClients";
import ClientDetailModal from "./ClientDetailModal";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PendingApprovalsCard() {
  const { clients, status, error, approve, reject } = usePendingClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleApprove = async (clientId: string) => {
    try {
      await approve(clientId);
    } catch {
      // error handled silently for now
    }
  };

  const handleReject = async (clientId: string) => {
    try {
      await reject(clientId);
    } catch {
      // error handled silently for now
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Pending Approvals
            </h3>
            <p className="text-xs text-gray-400">KYB & Onboarding Queue</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          {clients.length} Pending
        </span>
      </div>

      {status === "loading" && (
        <div className="py-8 text-center text-sm text-gray-400">
          Loading pending clients…
        </div>
      )}

      {status === "error" && (
        <div className="py-8 text-center text-sm text-red-500">
          {error || "Failed to load pending clients"}
        </div>
      )}

      {status === "success" && clients.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-400">
          No pending approvals
        </div>
      )}

      {status === "success" && clients.length > 0 && (
        <div className="space-y-3 mb-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedClientId(client.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                  {getInitials(client.companyName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {client.companyName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {client.industry && `${client.industry} · `}
                    {client.country && `${client.country} · `}
                    {client.registrationNumber || client.contactEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {client.createdAt && timeAgo(client.createdAt)}
                </span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleApprove(client.id)}
                    className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(client.id)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClientId && (
        <ClientDetailModal
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
