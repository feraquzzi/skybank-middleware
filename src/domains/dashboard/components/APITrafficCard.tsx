export default function APITrafficCard() {
  const timeLabels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "23:59"];
  const yLabels = ["1M / $100k", "3M / $300k", "5M / $500k"];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">API Traffic & Settlement Overview</h3>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-gray-400">Real-time throughput metrics across global gateway endpoints</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-xs text-gray-500">Settled Volume $4.92M</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-orange-500" />
              <span className="text-xs text-gray-500">API Inbound 2.84M calls</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded-md">Hourly</button>
            <button className="px-3 py-1.5 text-xs bg-white text-gray-900 rounded-md shadow-sm font-medium">Daily</button>
            <button className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded-md">Monthly</button>
          </div>
        </div>
      </div>

      <div className="relative h-64 mt-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-20">
          {yLabels.reverse().map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="absolute left-24 right-0 top-0 bottom-8">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-100" />
            ))}
          </div>

          {/* Tooltip */}
          <div className="absolute top-[20%] left-[48%] bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
            Peak: $840.5K (14:30 GMT)
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>

          {/* Line chart - solid orange line (Settled Volume) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,180 Q60,170 120,150 T240,120 T360,80 T480,60 T600,40"
              fill="none"
              stroke="rgb(249, 115, 22)"
              strokeWidth="3"
            />
            <path
              d="M0,180 Q60,170 120,150 T240,120 T360,80 T480,60 T600,40 L600,200 L0,200 Z"
              fill="url(#orangeGradient)"
            />
          </svg>

          {/* Line chart - dashed orange line (API Inbound) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <path
              d="M0,160 Q60,150 120,140 T240,130 T360,100 T480,80 T600,60"
              fill="none"
              stroke="rgb(249, 115, 22)"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.6"
            />
          </svg>

          {/* Data points */}
          <div className="absolute top-[35%] left-[50%] w-3 h-3 bg-white border-2 border-orange-500 rounded-full" />
          <div className="absolute top-[45%] left-[60%] w-3 h-3 bg-white border-2 border-orange-500 rounded-full" />
        </div>

        {/* X-axis labels */}
        <div className="absolute left-24 right-0 bottom-0 flex justify-between text-xs text-gray-400">
          {timeLabels.map((time) => (
            <span key={time} className={time === "12:00" ? "text-orange-500 font-medium" : ""}>
              {time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
