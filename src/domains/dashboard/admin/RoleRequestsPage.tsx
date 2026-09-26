import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { adminApi, ApiError } from "../../../lib/api";
import type { RoleChangeApplicationResponse } from "../../../lib/types";
import { describeRoleName } from "../../../lib/serviceCatalog";

type Status = "loading" | "success" | "error";

interface Flash {
  kind: "approved" | "rejected" | "error";
  text: string;
}

export default function RoleRequestsPage() {
  const [applications, setApplications] = useState<
    RoleChangeApplicationResponse[]
  >([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      setApplications(await adminApi.getPendingRoleApplications());
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load requests");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = async (
    application: RoleChangeApplicationResponse,
    action: "approve" | "reject",
  ) => {
    setBusyId(application.id);
    try {
      if (action === "approve") {
        await adminApi.approveRoleApplication(application.id);
      } else {
        await adminApi.rejectRoleApplication(application.id);
      }
      setApplications((prev) => prev.filter((a) => a.id !== application.id));
      setFlash({
        kind: action === "approve" ? "approved" : "rejected",
        text:
          action === "approve"
            ? `${application.username}'s roles were applied in Keycloak. Their token picks the change up on its next refresh.`
            : `${application.username}'s request was declined. Their existing roles are unchanged.`,
      });
    } catch (err) {
      setFlash({
        kind: "error",
        text:
          err instanceof ApiError
            ? `${err.message} (${err.status})`
            : err instanceof Error
              ? err.message
              : "The decision could not be saved",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-20 p-6">
        <TopNav portal="admin" />

        <div className="mb-6 mt-20">
          <h1 className="text-3xl font-bold text-gray-900">Role Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vendors ask for service roles here - approving writes them straight
            to Keycloak
          </p>
        </div>

        {flash && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${
              flash.kind === "approved"
                ? "bg-emerald-50 border-emerald-100"
                : flash.kind === "rejected"
                  ? "bg-gray-50 border-gray-200"
                  : "bg-red-50 border-red-100"
            }`}
          >
            <div className="flex-1 text-sm text-gray-700">{flash.text}</div>
            <button
              onClick={() => setFlash(null)}
              className="text-gray-400 hover:text-gray-600"
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

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Awaiting review
                </h2>
                <p className="text-xs text-gray-400">
                  Only one request can be open per vendor
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">
              {status === "success" ? applications.length : "—"} Pending
            </span>
          </div>

          {status === "loading" && (
            <div className="py-10 text-center text-sm text-gray-400">
              Loading requests…
            </div>
          )}

          {status === "error" && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-500 mb-3">
                {error || "Failed to load requests"}
              </p>
              <button
                onClick={() => void load()}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {status === "success" && applications.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">
                Nothing waiting for you
              </p>
              <p className="text-xs text-gray-400 mt-1">
                New role requests from vendors appear here.
              </p>
            </div>
          )}

          {status === "success" && applications.length > 0 && (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {initials(app.username)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {app.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {app.email} · requested {formatDate(app.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {app.requestedRoles.map((role) => (
                        <span
                          key={role}
                          title={describeRoleName(role).description}
                          className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-mono text-gray-600"
                        >
                          {describeRoleName(role).displayName}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => void decide(app, "reject")}
                        disabled={busyId === app.id}
                        className="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => void decide(app, "approve")}
                        disabled={busyId === app.id}
                        className="px-4 py-2 text-xs font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {busyId === app.id && (
                          <svg
                            className="w-3.5 h-3.5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        )}
                        Approve
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-3">
                    Approving replaces every service role this user holds with
                    the set above.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/[\s._-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
