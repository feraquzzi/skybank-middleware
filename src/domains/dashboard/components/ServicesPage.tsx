import { useState, useMemo } from "react";
import { useKeycloak } from "@react-keycloak/web";
import ServiceDetailModal from "./ServiceDetailModal";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

/* ─── Role metadata ─────────────────────────────────────────────── */

interface ServiceInfo {
  role: string;
  displayName: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
  category: string;
}

const ALL_SERVICES: ServiceInfo[] = [
  {
    role: "ROLE_VIEWER",
    displayName: "Platform Viewer",
    description:
      "Read-only access to monitor platform activity, view dashboards and analytics.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-400",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    category: "Monitoring",
  },
  {
    role: "ROLE_CLIENT",
    displayName: "Client Manager",
    description:
      "Core onboarding role for managing customer accounts and daily operations.",
    color: "orange",
    gradient: "from-orange-500 to-amber-400",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    category: "Onboarding",
  },
  {
    role: "ROLE_CREATE_CUSTOMER",
    displayName: "Customer Creator",
    description:
      "Specialized role for provisioning new customer accounts and profiles.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    category: "Customer Ops",
  },
  {
    role: "ROLE_VENDOR",
    displayName: "Vendor Operator",
    description:
      "Manages vendor operations, API service configuration and settlements.",
    color: "purple",
    gradient: "from-purple-500 to-violet-400",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    category: "Operations",
  },
];

const COLOR_CLASSES: Record<
  string,
  {
    card: string;
    badge: string;
    ring: string;
    iconBg: string;
    iconText: string;
    dot: string;
    glow: string;
  }
> = {
  blue: {
    card: "hover:border-blue-200 hover:shadow-blue-100/50",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    ring: "ring-blue-500/10",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    dot: "bg-blue-500",
    glow: "hover:shadow-blue-100",
  },
  orange: {
    card: "hover:border-orange-200 hover:shadow-orange-100/50",
    badge: "bg-orange-50 text-orange-600 border-orange-100",
    ring: "ring-orange-500/10",
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    dot: "bg-orange-500",
    glow: "hover:shadow-orange-100",
  },
  emerald: {
    card: "hover:border-emerald-200 hover:shadow-emerald-100/50",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ring: "ring-emerald-500/10",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    dot: "bg-emerald-500",
    glow: "hover:shadow-emerald-100",
  },
  purple: {
    card: "hover:border-purple-200 hover:shadow-purple-100/50",
    badge: "bg-purple-50 text-purple-600 border-purple-100",
    ring: "ring-purple-500/10",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    dot: "bg-purple-500",
    glow: "hover:shadow-purple-100",
  },
};

/* ─── Component ─────────────────────────────────────────────────── */

export default function ServicesPage() {
  const { keycloak, initialized } = useKeycloak();
  const [viewingRole, setViewingRole] = useState<string | null>(null);

  const userRoles = useMemo(() => {
    if (!initialized || !keycloak.authenticated) return [];
    return keycloak.realmAccess?.roles || [];
  }, [initialized, keycloak.authenticated, keycloak.realmAccess]);

  const userRoleSet = useMemo(() => new Set(userRoles), [userRoles]);

  const assignedServices = useMemo(
    () => ALL_SERVICES.filter((s) => userRoleSet.has(s.role)),
    [userRoleSet],
  );

  const availableServices = useMemo(
    () => ALL_SERVICES.filter((s) => !userRoleSet.has(s.role)),
    [userRoleSet],
  );

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav portal="vendor" />

      <Sidebar />

      <div className="ml-20 pt-24 p-6">
        {/* ── Page header ── */}
        <div className="mb-10">
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
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                {ALL_SERVICES.length} Available
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-gray-700">
                {assignedServices.length} Assigned
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-sm font-medium text-gray-700">
                {availableServices.length} Available to Request
              </span>
            </div>
          </div>
        </div>

        {/* ── Section 1: Assigned services ── */}
        {assignedServices.length > 0 && (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {assignedServices.map((service, i) => (
                <AssignedCard
                  key={service.role}
                  service={service}
                  index={i}
                  onView={() => setViewingRole(service.role)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 2: All services ── */}
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
              {ALL_SERVICES.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ALL_SERVICES.map((service, i) => {
              const isAssigned = userRoleSet.has(service.role);
              return (
                <AllServiceCard
                  key={service.role}
                  service={service}
                  index={i}
                  isAssigned={isAssigned}
                  onView={() => setViewingRole(service.role)}
                />
              );
            })}
          </div>
        </section>

        {/* ── Info banner ──
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Need additional services?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Contact your administrator to request access to additional services.
              New roles will appear in your assigned services once approved.
            </p>
          </div>
        </div> */}

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
          roleName={viewingRole}
          isAssigned={userRoleSet.has(viewingRole)}
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
  onView,
}: {
  service: ServiceInfo;
  index: number;
  onView: () => void;
}) {
  const c = COLOR_CLASSES[service.color] || COLOR_CLASSES.blue;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${c.card}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onView}
    >
      {/* Active glow dot */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
          Active
        </span>
      </div>

      {/* Icon */}
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

      {/* Category badge */}
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

      {/* Role tag */}
      <div className="flex items-center gap-1.5 mb-4">
        <code className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-mono rounded border border-gray-100">
          {service.role}
        </code>
      </div>

      {/* View button */}
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
  onView,
}: {
  service: ServiceInfo;
  index: number;
  isAssigned: boolean;
  onView: () => void;
}) {
  const c = COLOR_CLASSES[service.color] || COLOR_CLASSES.blue;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isAssigned
          ? "border-emerald-200 ring-1 ring-emerald-100"
          : "border-gray-100"
      } ${c.card}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onView}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        {isAssigned ? (
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

      {/* Icon */}
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

      {/* Category */}
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

      {/* Role tag */}
      <code className="inline-block px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-mono rounded border border-gray-100 mb-4">
        {service.role}
      </code>

      {/* View button */}
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
