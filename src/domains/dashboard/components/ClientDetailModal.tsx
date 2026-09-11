import { useEffect, useState } from "react";
import { adminApi, type ClientResponse } from "../../../lib/api";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ClientDetailModalProps {
  clientId: string;
  onClose: () => void;
  onApprove: (clientId: string, roles: string[]) => void;
  onReject: (clientId: string) => void;
}

export default function ClientDetailModal({
  clientId,
  onClose,
  onApprove,
  onReject,
}: ClientDetailModalProps) {
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    adminApi
      .getClient(clientId)
      .then((data) => {
        if (!cancelled) {
          setClient(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load client",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  useEffect(() => {
    let cancelled = false;
    setRolesLoading(true);

    adminApi
      .getRoles()
      .then((data) => {
        if (!cancelled) {
          setAvailableRoles(data);
          setRolesLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableRoles([]);
          setRolesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleApprove = async () => {
    if (!client) return;
    setActing(true);
    try {
      await onApprove(client.id, selectedRoles);
      onClose();
    } catch {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!client) return;
    setActing(true);
    try {
      await onReject(client.id);
      onClose();
    } catch {
      setActing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Client Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
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

        {/* Body */}
        <div className="p-6">
          {loading && (
            <div className="py-12 text-center text-sm text-gray-400">
              Loading client details…
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {client && (
            <div className="space-y-6">
              {/* Company header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-lg font-bold text-orange-600">
                  {getInitials(client.companyName)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {client.companyName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {client.industry || "—"} · {client.country || "—"}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Status:
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {client.status}
                </span>
              </div>

              {/* Company info */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Company Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField
                    label="Registration Number"
                    value={client.registrationNumber}
                  />
                  <DetailField label="Tax ID" value={client.taxId} />
                  <DetailField
                    label="Company Address"
                    value={client.address || client.companyAddress}
                    span={2}
                  />
                  <DetailField label="Phone" value={client.phoneNumber} />
                  <DetailField label="Country" value={client.country} />
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Contact Person
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField
                    label="Name"
                    value={`${client.contactFirstName} ${client.contactLastName}`}
                  />
                  <DetailField label="Email" value={client.contactEmail} />
                  <DetailField label="Phone" value={client.contactPhone} />
                  <DetailField
                    label="Users"
                    value={String(client.userCount ?? 0)}
                  />
                </div>
              </div>

              {/* Dates */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Timeline
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField
                    label="Registered"
                    value={formatDate(client.createdAt)}
                  />
                  <DetailField
                    label="Approved"
                    value={formatDate(client.approvedAt)}
                  />
                </div>
              </div>

              {/* Role assignment */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Assign Roles
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                    ROLE_CLIENT
                  </code>{" "}
                  is always assigned automatically.
                </p>
                {rolesLoading ? (
                  <p className="text-xs text-gray-400">Loading roles…</p>
                ) : availableRoles.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No additional roles available
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          selectedRoles.includes(role)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                        }`}
                      >
                        {selectedRoles.includes(role) && (
                          <svg
                            className="inline w-3 h-3 mr-1 -mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {client && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleReject}
              disabled={acting}
              className="px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {acting ? "Processing…" : "Reject"}
            </button>
            <button
              onClick={handleApprove}
              disabled={acting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {acting ? "Processing…" : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  span,
}: {
  label: string;
  value: string | null | undefined;
  span?: number;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}
