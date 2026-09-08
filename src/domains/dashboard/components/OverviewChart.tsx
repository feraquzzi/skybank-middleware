interface OverviewChartProps {
  currentYearValue: string;
  lastYearValue: string;
}

export default function OverviewChart({ currentYearValue, lastYearValue }: OverviewChartProps) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yLabels = ["0", "1K", "2K", "3K", "4K", "5K"];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          Last 30 days
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-sm text-gray-500">Current Year</span>
          <span className="text-sm font-semibold text-gray-900">{currentYearValue}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-orange-500" />
          <span className="text-sm text-gray-500">Last Year</span>
          <span className="text-sm font-semibold text-gray-900">{lastYearValue}</span>
        </div>
      </div>

      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-8">
          {yLabels.reverse().map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-8">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border-b border-gray-100" />
            ))}
          </div>

          {/* Line chart - solid orange line (current year) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,160 Q40,150 80,130 T160,100 T240,120 T320,80 T400,60 T500,40"
              fill="none"
              stroke="rgb(249, 115, 22)"
              strokeWidth="3"
            />
            <path
              d="M0,160 Q40,150 80,130 T160,100 T240,120 T320,80 T400,60 T500,40 L500,200 L0,200 Z"
              fill="url(#orangeGradient)"
            />
          </svg>

          {/* Line chart - dashed orange line (last year) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
            <path
              d="M0,180 Q40,170 80,150 T160,140 T240,160 T320,130 T400,110 T500,90"
              fill="none"
              stroke="rgb(249, 115, 22)"
              strokeWidth="2"
              strokeDasharray="8,4"
              opacity="0.5"
            />
          </svg>

          {/* Data points */}
          <div className="absolute top-[30%] left-[48%] w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow" />
          <div className="absolute top-[40%] left-[60%] w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow" />
        </div>

        {/* X-axis labels */}
        <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-gray-400">
          {months.map((month) => (
            <span key={month} className={month === "May" ? "text-gray-900 font-medium" : ""}>
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
