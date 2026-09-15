import { useState, useEffect } from "react";

interface RoleDetail {
  name: string;
  displayName: string;
  description: string;
  color: string;
  gradient: string;
  capabilities: string[];
  endpoints: { method: string; path: string; description: string }[];
  accessLevel: string;
  category: string;
}

const ROLE_DETAILS: Record<string, RoleDetail> = {
  ROLE_VIEWER: {
    name: "ROLE_VIEWER",
    displayName: "Platform Viewer",
    description:
      "Read-only access to monitor platform activity, view dashboards, and generate analytics reports without modifying any data.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-400",
    capabilities: [
      "View transaction dashboards and reports",
      "Monitor API traffic and system health",
      "Access analytics and business intelligence",
      "Export read-only data summaries",
      "View audit logs and activity trails",
    ],
    endpoints: [
      { method: "GET", path: "/api/admin/clients", description: "List all registered clients" },
      { method: "GET", path: "/api/admin/roles", description: "List available roles" },
      { method: "GET", path: "/api/admin/clients/pending", description: "View pending approvals" },
    ],
    accessLevel: "Read-only",
    category: "Monitoring",
  },
  ROLE_CLIENT: {
    name: "ROLE_CLIENT",
    displayName: "Client Manager",
    description:
      "Core onboarding role for managing customer accounts, processing registrations, and handling day-to-day client operations.",
    color: "orange",
    gradient: "from-orange-500 to-amber-400",
    capabilities: [
      "Manage customer onboarding workflows",
      "Process and verify KYC documents",
      "Handle account creation and updates",
      "Access customer support tools",
      "Manage client communication channels",
    ],
    endpoints: [
      { method: "POST", path: "/api/register", description: "Register new client accounts" },
      { method: "GET", path: "/api/check-availability", description: "Check username/email availability" },
      { method: "GET", path: "/api/admin/clients/{id}", description: "Retrieve client details" },
    ],
    accessLevel: "Standard",
    category: "Onboarding",
  },
  ROLE_CREATE_CUSTOMER: {
    name: "ROLE_CREATE_CUSTOMER",
    displayName: "Customer Creator",
    description:
      "Specialized role for provisioning new customer accounts, managing initial setup, and configuring customer profiles in the banking system.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    capabilities: [
      "Create and provision customer accounts",
      "Set up initial account configurations",
      "Manage customer profile data",
      "Assign initial account permissions",
      "Handle bulk customer imports",
    ],
    endpoints: [
      { method: "POST", path: "/api/customers", description: "Create a new customer" },
      { method: "PUT", path: "/api/customers/{id}", description: "Update customer profile" },
      { method: "POST", path: "/api/customers/bulk", description: "Bulk import customers" },
    ],
    accessLevel: "Elevated",
    category: "Customer Ops",
  },
  ROLE_VENDOR: {
    name: "ROLE_VENDOR",
    displayName: "Vendor Operator",
    description:
      "Manages vendor operations, API service configuration, settlement processes, and integration with external financial services.",
    color: "purple",
    gradient: "from-purple-500 to-violet-400",
    capabilities: [
      "Manage vendor API integrations",
      "Configure settlement and payout rules",
      "Monitor real-time transaction flows",
      "Handle vendor-specific service configs",
      "Access premium support channels",
    ],
    endpoints: [
      { method: "GET", path: "/api/vendor/transactions", description: "View vendor transactions" },
      { method: "PUT", path: "/api/vendor/config", description: "Update vendor configuration" },
      { method: "POST", path: "/api/vendor/settlements", description: "Process settlements" },
    ],
    accessLevel: "Elevated",
    category: "Operations",
  },
};

const COLOR_MAP: Record<string, { badge: string; ring: string; text: string; bg: string; dot: string }> = {
  blue: { badge: "bg-blue-50 text-blue-600", ring: "ring-blue-100", text: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
  orange: { badge: "bg-orange-50 text-orange-600", ring: "ring-orange-100", text: "text-orange-600", bg: "bg-orange-50", dot: "bg-orange-500" },
  emerald: { badge: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-100", text: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  purple: { badge: "bg-purple-50 text-purple-600", ring: "ring-purple-100", text: "text-purple-600", bg: "bg-purple-50", dot: "bg-purple-500" },
};

interface ServiceDetailModalProps {
  roleName: string;
  isAssigned: boolean;
  onClose: () => void;
}

type RequestAction = "add" | "remove";

export default function ServiceDetailModal({ roleName, isAssigned, onClose }: ServiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "endpoints">("overview");
  const [requested, setRequested] = useState<RequestAction | null>(null);
  const detail = ROLE_DETAILS[roleName];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!detail) return null;

  const colors = COLOR_MAP[detail.color] || COLOR_MAP.blue;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={`relative flex-shrink-0 bg-gradient-to-r ${detail.gradient} px-8 pt-8 pb-12`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <RoleIcon role={roleName} className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-white text-xs font-medium backdrop-blur-sm">
                {detail.category}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{detail.displayName}</h2>
          <p className="text-white/80 text-sm font-mono">{detail.name}</p>

          {/* Status badge */}
          <div className="mt-4">
            {isAssigned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/25 rounded-full text-white text-xs font-medium backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Active on your account
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-white/70 text-xs font-medium backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                Not assigned
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-100 px-8">
          <div className="flex gap-1 -mb-px">
            {(["overview", "endpoints"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? `border-current ${colors.text}`
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "overview" ? "Overview" : "API Access"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 min-h-0">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${colors.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  {detail.accessLevel}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  JWT Protected
                </span>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Capabilities
                </h4>
                <ul className="space-y-2.5">
                  {detail.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`mt-1 w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-3 h-3 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm text-gray-700">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 mb-4">
                API endpoints accessible with this role. Bearer token required.
              </p>
              {detail.endpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      ep.method === "GET"
                        ? "bg-emerald-100 text-emerald-700"
                        : ep.method === "POST"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-xs font-mono text-gray-700 flex-1">{ep.path}</code>
                  <span className="text-[11px] text-gray-400 hidden sm:block">{ep.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-8 py-5 border-t border-gray-100">
          {requested ? (
            /* Confirmation state after a request is sent */
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {requested === "add" ? "Access request sent" : "Removal request sent"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your administrator will review this request for {detail.displayName}.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3">
                {isAssigned
                  ? "Need to change your access? Send a request to your administrator."
                  : "This service is not assigned to you. Request access from your administrator."}
              </p>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  onClick={onClose}
                  className="order-3 sm:order-1 w-full sm:w-auto shrink-0 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>

                <div className="hidden sm:block sm:order-2 sm:flex-1" />

                {isAssigned && (
                  <button
                    onClick={() => setRequested("remove")}
                    className="order-2 sm:order-3 w-full sm:w-auto shrink-0 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                    Request to Remove
                  </button>
                )}

                <button
                  onClick={() => setRequested("add")}
                  className="order-1 sm:order-4 w-full sm:w-auto shrink-0 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Request to Add
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleIcon({ role, className }: { role: string; className?: string }) {
  const icons: Record<string, string> = {
    ROLE_VIEWER:
      "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    ROLE_CLIENT:
      "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    ROLE_CREATE_CUSTOMER:
      "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    ROLE_VENDOR:
      "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[role] || icons.ROLE_VIEWER} />
    </svg>
  );
}
