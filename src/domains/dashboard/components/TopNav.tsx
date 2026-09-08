interface TopNavProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications?: number;
  userName?: string;
}

export default function TopNav({
  tabs,
  activeTab,
  onTabChange,
  notifications = 12,
  userName = "Liona Horan",
}: TopNavProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-sm">
      <nav className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-orange-500 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <button className="relative flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          Notifications
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-400">Welcome Back!</p>
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
