interface Company {
  initials: string;
  name: string;
  details: string;
  status: string;
  statusDetail: string;
  statusColor: "orange" | "blue" | "green";
  urgent?: boolean;
}

const companies: Company[] = [
  {
    initials: "AG",
    name: "Apex Global Technologies Inc.",
    details: "Series B · United States · Delaware C-Corp",
    status: "Review KYB",
    statusDetail: "Urgent · Due today",
    statusColor: "orange",
    urgent: true,
  },
  {
    initials: "NL",
    name: "Nexus Logistics GmbH",
    details: "Mid-Market · Germany · Docs Complete",
    status: "Compliance",
    statusDetail: "Pending Sign-off",
    statusColor: "blue",
  },
  {
    initials: "SV",
    name: "Solaris Ventures Pte. Ltd.",
    details: "Enterprise · Singapore · Ownership Review",
    status: "Verification",
    statusDetail: "Awaiting 2FA",
    statusColor: "green",
  },
];

export default function PendingApprovalsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Pending Approvals</h3>
            <p className="text-xs text-gray-400">KYB & Onboarding Queue</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          5 Pending
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-bold text-gray-900">18 Companies</span>
        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          3 urgent KYB
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {companies.map((company) => (
          <div key={company.initials} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                {company.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{company.name}</p>
                <p className="text-xs text-gray-400">{company.details}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{company.status}</p>
              <p className={`text-xs ${company.urgent ? "text-orange-500" : "text-gray-400"}`}>
                {company.statusDetail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button className="text-sm text-gray-500 hover:text-gray-700">
          View all 18 companies
        </button>
        <button className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors">
          Approve Selected Companies
        </button>
      </div>
    </div>
  );
}
