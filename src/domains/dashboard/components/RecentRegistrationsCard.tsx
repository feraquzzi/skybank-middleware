interface Registration {
  initials: string;
  name: string;
  jurisdiction: string;
  submitted: string;
  time: string;
  risk: string;
  riskLevel: "green" | "orange";
  representative: string;
}

const registrations: Registration[] = [
  {
    initials: "AF",
    name: "Apex Fintech Corp",
    jurisdiction: "Delaware C-Corp · United States",
    submitted: "Oct 24, 2025",
    time: "10:42 AM",
    risk: "Documents Verified · Low Risk",
    riskLevel: "green",
    representative: "Sarah Jenkins",
  },
  {
    initials: "VP",
    name: "Vanguard Pay Ltd",
    jurisdiction: "UK Ltd · United Kingdom",
    submitted: "Oct 24, 2025",
    time: "09:15 AM",
    risk: "UBO Review · Standard",
    riskLevel: "orange",
    representative: "Lukas Meyer",
  },
  {
    initials: "NH",
    name: "Nordic Horizon AB",
    jurisdiction: "Sweden AB · Sweden",
    submitted: "Oct 23, 2025",
    time: "04:30 PM",
    risk: "Address Check · Low Risk",
    riskLevel: "green",
    representative: "Astrid Lindgren",
  },
  {
    initials: "AR",
    name: "Aether Robotics Inc",
    jurisdiction: "California Corp · United States",
    submitted: "Oct 23, 2025",
    time: "01:20 PM",
    risk: "Tax ID Review · Pending",
    riskLevel: "orange",
    representative: "David Chen",
  },
  {
    initials: "SB",
    name: "Solaria Bio AG",
    jurisdiction: "Switzerland AG · Switzerland",
    submitted: "Oct 22, 2025",
    time: "11:05 AM",
    risk: "Fast-track · Low Risk",
    riskLevel: "green",
    representative: "Marcelle Dubois",
  },
];

export default function RecentRegistrationsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Recent Registrations Awaiting Approval</h3>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                5 New Requests
              </span>
            </div>
            <p className="text-xs text-gray-400">5 pending company verification reviews</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 bg-gray-50 rounded-lg">
            Filter Status
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 bg-gray-50 rounded-lg">
            All Jurisdictions
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">COMPANY & JURISDICTION</th>
              <th className="pb-3 font-medium">SUBMITTED</th>
              <th className="pb-3 font-medium">KYB REVIEW / RISK</th>
              <th className="pb-3 font-medium">REPRESENTATIVE</th>
              <th className="pb-3 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.initials} className="border-b border-gray-50 last:border-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {reg.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reg.name}</p>
                      <p className="text-xs text-gray-400">{reg.jurisdiction}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-sm text-gray-900">{reg.submitted}</p>
                  <p className="text-xs text-gray-400">{reg.time}</p>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    reg.riskLevel === "green"
                      ? "bg-green-50 text-green-600"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      reg.riskLevel === "green" ? "bg-green-500" : "bg-orange-500"
                    }`} />
                    {reg.risk}
                  </span>
                </td>
                <td className="py-4">
                  <span className="text-sm text-gray-600">{reg.representative}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-4 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-2 text-sm text-orange-500 font-medium hover:text-orange-600 px-5 py-2.5 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors">
          View All Registrations (18)
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
