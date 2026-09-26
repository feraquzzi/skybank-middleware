import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { adminApi, ApiError } from "../../../lib/api";
import type { AdminUserResponse } from "../../../lib/types";

type Status = "loading" | "success" | "error";

/** Roles that may never be granted or revoked through this screen. */
const PROTECTED_ROLES = new Set(["ROLE_ADMIN", "ROLE_CLIENT"]);

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async (search: string) => {
    setStatus("loading");
    setError(null);
    try {
      setUsers(await adminApi.getUsers(search.trim() || undefined));
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users");
      setStatus("error");
    }
  }, []);

  // Debounced search - the endpoint matches on username, email and name.
  useEffect(() => {
    const timer = setTimeout(() => void load(query), 300);
    return () => clearTimeout(timer);
  }, [query, load]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-20 p-6">
        <TopNav portal="admin" />

        <div className="mb-6 mt-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              Search Keycloak accounts and grant or revoke their service roles
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search username, email or name…"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">
              {query ? `Results for “${query}”` : "All users"}
            </h2>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              {status === "success" ? users.length : "—"}
            </span>
          </div>

          {status === "loading" && (
            <div className="py-10 text-center text-sm text-gray-400">
              Loading users…
            </div>
          )}

          {status === "error" && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-500 mb-3">
                {error || "Failed to load users"}
              </p>
              <button
                onClick={() => void load(query)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {status === "success" && users.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No users match that search.
            </div>
          )}

          {status === "success" && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Email</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium">Roles</th>
                    <th className="py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.keycloakUserId}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 flex-shrink-0">
                            {initials(user)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.firstName
                                ? `${user.firstName} ${user.lastName}`.trim()
                                : user.username}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            user.enabled
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.enabled ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {user.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {user.roles.length === 0 ? (
                            <span className="text-xs text-gray-400">
                              No roles
                            </span>
                          ) : (
                            user.roles.map((role) => (
                              <span
                                key={role}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                  PROTECTED_ROLES.has(role)
                                    ? "bg-gray-50 text-gray-400 border-gray-100"
                                    : "bg-orange-50 text-orange-600 border-orange-100"
                                }`}
                              >
                                {role}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedId(user.keycloakUserId)}
                          className="px-3.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedId && (
        <UserDetailModal
          userId={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={(updated) =>
            setUsers((prev) =>
              prev.map((u) =>
                u.keycloakUserId === updated.keycloakUserId ? updated : u,
              ),
            )
          }
        />
      )}
    </div>
  );
}

/* ─── Detail / role management ──────────────────────────────────── */

function UserDetailModal({
  userId,
  onClose,
  onChanged,
}: {
  userId: string;
  onClose: () => void;
  onChanged: (user: AdminUserResponse) => void;
}) {
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([adminApi.getUser(userId), adminApi.getRoles()])
      .then(([u, roles]) => {
        if (cancelled) return;
        setUser(u);
        setAvailableRoles(roles);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Could not load this user",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const run = async (action: () => Promise<AdminUserResponse>) => {
    setBusy(true);
    setError(null);
    try {
      const updated = await action();
      setUser(updated);
      onChanged(updated);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `${err.message} (${err.status})`
          : err instanceof Error
            ? err.message
            : "That change could not be saved",
      );
    } finally {
      setBusy(false);
    }
  };

  const assigned = user?.roles ?? [];
  const grantable = availableRoles.filter(
    (role) => !assigned.includes(role) && !PROTECTED_ROLES.has(role),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Manage user</h2>
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

        <div className="p-6 overflow-y-auto">
          {loading && (
            <div className="py-10 text-center text-sm text-gray-400">
              Loading user…
            </div>
          )}

          {error && !loading && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {user && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-sm font-bold text-orange-600">
                  {initials(user)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName}`.trim()
                      : user.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Account switches */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Account
                </h4>
                <div className="space-y-2">
                  <Toggle
                    label="Sign-in enabled"
                    hint="Turning this off blocks the user from signing in without deleting the account."
                    checked={user.enabled}
                    busy={busy}
                    onChange={(next) =>
                      void run(() =>
                        adminApi.updateUser(user.keycloakUserId, {
                          enabled: next,
                        }),
                      )
                    }
                  />
                  <Toggle
                    label="Email verified"
                    hint="Marks the email address as confirmed with Keycloak."
                    checked={user.emailVerified}
                    busy={busy}
                    onChange={(next) =>
                      void run(() =>
                        adminApi.updateUser(user.keycloakUserId, {
                          emailVerified: next,
                        }),
                      )
                    }
                  />
                </div>
              </div>

              {/* Roles */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Service roles
                </h4>

                <div className="flex flex-wrap gap-2 mb-4">
                  {assigned.length === 0 && (
                    <p className="text-xs text-gray-400">
                      No roles assigned yet.
                    </p>
                  )}
                  {assigned.map((role) => {
                    const protectedRole = PROTECTED_ROLES.has(role);
                    return (
                      <span
                        key={role}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                          protectedRole
                            ? "bg-gray-50 text-gray-500 border-gray-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {role}
                        {protectedRole ? (
                          <span className="text-[9px] uppercase tracking-wide text-gray-400">
                            fixed
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              void run(() =>
                                adminApi.unassignRoles(user.keycloakUserId, [
                                  role,
                                ]),
                              )
                            }
                            disabled={busy}
                            className="text-orange-400 hover:text-orange-700 disabled:opacity-50"
                            title={`Remove ${role}`}
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-400 mb-2">Add a role</p>
                <div className="flex flex-wrap gap-2">
                  {grantable.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      Every available role is already assigned.
                    </p>
                  ) : (
                    grantable.map((role) => (
                      <button
                        key={role}
                        disabled={busy}
                        onClick={() =>
                          void run(() =>
                            adminApi.assignRoles(user.keycloakUserId, [role]),
                          )
                        }
                        className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50"
                      >
                        + {role}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  busy,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  busy: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer">
      <span>
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        <span className="block text-xs text-gray-400 mt-0.5">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={busy}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 ${
          checked ? "bg-orange-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}

function initials(user: AdminUserResponse) {
  const source =
    (user.firstName || user.lastName)
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.username;
  return source
    .split(/[\s._-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
