import { useState, useMemo } from "react";
import { useKeycloak } from "@react-keycloak/web";
import ServiceDetailModal, {
  type RequestAvailability,
} from "./ServiceDetailModal";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import {
  useRoleApplications,
  pendingChangeForRole,
  SYSTEM_ROLES,
} from "../../../lib/useRoleApplications";
import {
  useServiceCatalog,
  serviceStyles,
  type ServiceInfo,
} from "../../../lib/serviceCatalog";

/* ─── Component ─────────────────────────────────────────────────── */

export default function ServicesPage() {
  const { initialized } = useKeycloak();
  const [viewingRole, setViewingRole] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  // The catalogue is read live from the backend, so a role added in Keycloak shows up here
  // without a frontend release.
  const {
    services: catalog,
    status: catalogStatus,
    error: catalogError,
    retry,
  } = useServiceCatalog();

  // The hook re-reads these roles after an approved request refreshes the token.
  const {
    roles: userRoles,
    pending,
    submit,
    decision,
    dismissDecision,
  } = useRoleApplications();

  const userRoleSet = useMemo(() => new Set(userRoles), [userRoles]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(catalog.map((s) => s.category))).sort()],
    [catalog],
  );

  const visibleServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalog.filter((service) => {
      const matchesCategory = category === "All" || service.category === category;
      const matchesQuery =
        !needle ||
        service.displayName.toLowerCase().includes(needle) ||
        service.role.toLowerCase().includes(needle) ||
        service.description.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [catalog, category, query]);

  const assignedServices = useMemo(
    () => visibleServices.filter((s) => userRoleSet.has(s.role)),
    [visibleServices, userRoleSet],
  );

  // Only vendor accounts may request service roles, and system roles are never requestable.
  const canRequestRoles = userRoleSet.has("ROLE_CLIENT");

  const availabilityFor = (role: string): RequestAvailability => {
    if (SYSTEM_ROLES.has(role)) {
      return {
        kind: "unavailable",
        reason:
          "This role is granted automatically with your account, so it can't be requested or removed.",
      };
    }
    if (!canRequestRoles) {
      return {
        kind: "unavailable",
        reason:
          "Only vendor accounts can request service roles. Ask an administrator to change the roles on this account.",
      };
    }
    if (pending) {
      return {
        kind: "awaiting-review",
        changeForThisRole: pendingChangeForRole(
          pending,
          role,
          userRoleSet.has(role),
        ),
        since: pending.createdAt,
      };
    }
    return { kind: "available" };
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
        <LoadingSpinner />
      </div>
    );
  }

  const assignedCount = catalog.filter((s) => userRoleSet.has(s.role)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav portal="vendor" />

      <Sidebar />

      <div className="ml-20 pt-24 p-6">
        {/* ── Page header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage your platform services and role-based access
              </p>
            </div>
          </div>

          {/* Summary pills */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                {catalog.length} Services
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-gray-700">
                {assignedCount} Assigned
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-sm font-medium text-gray-700">
                {catalog.length - assignedCount} Available to Request
              </span>
            </div>
            {pending && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-medium text-amber-700">
                  1 Pending Review
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Outcome of the last request ── */}
        {decision && (
          <div
            className={`mb-8 flex items-start gap-4 rounded-2xl border p-5 ${
              decision.status === "APPROVED"
                ? "bg-emerald-50 border-emerald-100"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                decision.status === "APPROVED" ? "bg-emerald-100" : "bg-gray-200"
              }`}
            >
              {decision.status === "APPROVED" ? (
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500"
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
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-semibold ${
                  decision.status === "APPROVED"
                    ? "text-emerald-900"
                    : "text-gray-900"
                }`}
              >
                {decision.status === "APPROVED"
                  ? "Your access has been updated"
                  : "Your request was declined"}
              </h3>
              <p
                className={`text-sm mt-1 leading-relaxed ${
                  decision.status === "APPROVED"
                    ? "text-emerald-700"
                    : "text-gray-500"
                }`}
              >
                {decision.status === "APPROVED"
                  ? `Your administrator approved ${formatRoles(decision.requestedRoles, catalog)}. Your new roles are active.`
                  : `Your administrator declined ${formatRoles(decision.requestedRoles, catalog)}. Your existing access is unchanged.`}
              </p>
            </div>

            <button
              onClick={dismissDecision}
              aria-label="Dismiss"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/70 transition-colors flex-shrink-0"
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

        {/* ── Search + category filters ── */}
        {catalogStatus === "success" && catalog.length > 0 && (
          <div className="mb-8 space-y-3">
            {/* Search — full width on mobile, capped once there is room */}
            <div className="relative w-full sm:max-w-md">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
                placeholder="Search by name, role or description…"
                className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
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
              )}
            </div>

            {/* Category chips — always wrapped directly under the search field */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const count =
                  c === "All"
                    ? catalog.length
                    : catalog.filter((s) => s.category === c).length;
                const active = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 active:scale-95 ${
                      active
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {c}
                    <span
                      className={`px-1.5 py-px rounded-full text-[10px] font-semibold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Catalogue loading / error ── */}
        {catalogStatus === "loading" && (
          <div className="py-24">
            <LoadingSpinner />
          </div>
        )}

        {catalogStatus === "error" && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-500 mb-4">
              {catalogError || "Could not load the service catalogue"}
            </p>
            <button
              onClick={() => void retry()}
              className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Section 1: Assigned services ── */}
        {catalogStatus === "success" && assignedServices.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your Assigned Services
              </h2>
              <span className="ml-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
                {assignedServices.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {assignedServices.map((service, i) => (
                <AssignedCard
                  key={service.role}
                  service={service}
                  index={i}
                  pendingChange={pendingChangeForRole(pending, service.role, true)}
                  onView={() => setViewingRole(service.role)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 2: All services ── */}
        {catalogStatus === "success" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Platform Services
              </h2>
              <span className="ml-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">
                {visibleServices.length}
              </span>
            </div>

            {visibleServices.length === 0 ? (
              <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  No services match “{query || category}”
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try another term, or clear the category filter.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visibleServices.map((service, i) => {
                  const isAssigned = userRoleSet.has(service.role);
                  return (
                    <AllServiceCard
                      key={service.role}
                      service={service}
                      index={i}
                      isAssigned={isAssigned}
                      pendingChange={pendingChangeForRole(
                        pending,
                        service.role,
                        isAssigned,
                      )}
                      onView={() => setViewingRole(service.role)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>
            Sky Bank Sierra Leone Limited · Authorized by Bank of Sierra Leone
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-600">
              API Documentation
            </a>
            <a href="#" className="hover:text-gray-600">
              Developer Sandbox
            </a>
            <a href="#" className="hover:text-gray-600">
              Security & Compliance
            </a>
          </div>
        </footer>
      </div>

      {/* ── Detail modal ── */}
      {viewingRole && (
        <ServiceDetailModal
          service={
            catalog.find((s) => s.role === viewingRole) ?? {
              role: viewingRole,
              displayName: viewingRole,
              description: "",
              category: "Services",
              color: "blue",
              gradient: "from-blue-500 to-cyan-400",
              icon: "",
              capabilities: [],
              accessLevel: "Standard",
            }
          }
          isAssigned={userRoleSet.has(viewingRole)}
          assignedRoles={userRoles}
          availability={availabilityFor(viewingRole)}
          onSubmit={submit}
          onClose={() => setViewingRole(null)}
        />
      )}
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────────────── */

function AssignedCard({
  service,
  index,
  pendingChange,
  onView,
}: {
  service: ServiceInfo;
  index: number;
  pendingChange: "add" | "remove" | null;
  onView: () => void;
}) {
  const c = serviceStyles[service.color] ?? serviceStyles.blue;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${c.card}`}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={onView}
    >
      {/* Active glow dot, or the change that is awaiting review */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        {pendingChange ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-full border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {pendingChange === "remove" ? "Removal pending" : "Change pending"}
          </span>
        ) : (
          <>
            <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
              Active
            </span>
          </>
        )}
      </div>

      <div
        className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center mb-4 ring-1 ${c.ring}`}
      >
        <svg
          className={`w-6 h-6 ${c.iconText}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
        </svg>
      </div>

      <span
        className={`inline-block px-2 py-0.5 ${c.badge} text-[10px] font-semibold uppercase tracking-wider rounded-md border mb-3`}
      >
        {service.category}
      </span>

      <h3 className="text-base font-semibold text-gray-900 mb-1.5">
        {service.displayName}
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center gap-1.5 mb-4">
        <code className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-mono rounded border border-gray-100">
          {service.role}
        </code>
      </div>

      <button
        className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all group-hover:border-gray-300 flex items-center justify-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        View Details
      </button>
    </div>
  );
}

function AllServiceCard({
  service,
  index,
  isAssigned,
  pendingChange,
  onView,
}: {
  service: ServiceInfo;
  index: number;
  isAssigned: boolean;
  pendingChange: "add" | "remove" | null;
  onView: () => void;
}) {
  const c = serviceStyles[service.color] ?? serviceStyles.blue;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isAssigned
          ? "border-emerald-200 ring-1 ring-emerald-100"
          : "border-gray-100"
      } ${c.card}`}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={onView}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        {pendingChange === "add" ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-full border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Requested
          </span>
        ) : pendingChange === "remove" ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-full border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Removal pending
          </span>
        ) : isAssigned ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full border border-emerald-100">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Assigned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-semibold rounded-full border border-gray-100">
            Available
          </span>
        )}
      </div>

      <div
        className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center mb-4 ring-1 ${c.ring}`}
      >
        <svg
          className={`w-6 h-6 ${c.iconText}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
        </svg>
      </div>

      <span
        className={`inline-block px-2 py-0.5 ${c.badge} text-[10px] font-semibold uppercase tracking-wider rounded-md border mb-3`}
      >
        {service.category}
      </span>

      <h3 className="text-base font-semibold text-gray-900 mb-1.5">
        {service.displayName}
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {service.description}
      </p>

      <code className="inline-block px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-mono rounded border border-gray-100 mb-4">
        {service.role}
      </code>

      <button
        className={`w-full py-2.5 px-4 text-sm font-medium rounded-xl border transition-all flex items-center justify-center gap-2 ${
          isAssigned
            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        View Details
      </button>
    </div>
  );
}

function formatRoles(roles: string[], catalog: ServiceInfo[]): string {
  const names = roles.map(
    (role) => catalog.find((s) => s.role === role)?.displayName ?? role,
  );
  if (names.length === 0) return "your requested services";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function LoadingSpinner() {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 animate-pulse" />
        <div className="absolute inset-0 w-16 h-16 bg-orange-500/20 blur-xl rounded-2xl animate-ping" />
      </div>
      <p className="text-gray-500 text-sm font-medium tracking-wider uppercase">
        Loading services…
      </p>
      <div className="mt-4 w-40 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-shimmer"
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}
