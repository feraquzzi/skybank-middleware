import logo from "../../../assets/skybank-logo.png";
import { getDisplayName, getInitials } from "../../../lib/user";

interface TopNavProps {
  portal?: "admin" | "vendor";
}

export default function TopNav({ portal = "vendor" }: TopNavProps) {
  const displayName = getDisplayName();
  const initials = getInitials();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Sky Bank Sierra Leone" className="h-10" />
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg tracking-wide">
            {portal === "admin" ? "ADMIN PORTAL" : "VENDOR PORTAL"}
          </span>
        </div>

        <div className="relative flex-1 max-w-2xl mx-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search services, transactions, API keys..."
            className="w-full pl-12 pr-14 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md font-mono border border-gray-200">
            ⌘K
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {displayName}
              </p>
              <p className="text-xs text-gray-400">
                {portal === "admin" ? "Administrator" : "Vendor"}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
