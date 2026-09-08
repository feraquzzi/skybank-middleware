import { useState } from "react";

interface Company {
  initials: string;
  name: string;
  type: string;
  location: string;
  volume: string;
  amount: string;
  tier: string;
}

const companies: Company[] = [
  {
    initials: "SC",
    name: "Stripe Capital Partner",
    type: "Fintech",
    location: "US",
    volume: "$4.8M/mo volume",
    amount: "$12.4M",
    tier: "Tier 1 Reserve",
  },
  {
    initials: "NL",
    name: "Nordic Logistics AS",
    type: "Mid-Market",
    location: "Norway",
    volume: "$1.2M/mo volume",
    amount: "$3.8M",
    tier: "Treasury Plus",
  },
  {
    initials: "ZC",
    name: "Zephyr Cloud Systems",
    type: "Enterprise",
    location: "UK",
    volume: "$850k/mo volume",
    amount: "$2.1M",
    tier: "Standard Corp",
  },
];

const tabs = ["All (1,290)", "Enterprise", "Mid-Market", "Fintech"];

export default function ActiveCompaniesCard() {
  const [activeTab, setActiveTab] = useState("All (1,290)");

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
            <h3 className="text-sm font-semibold text-gray-900">Active Companies</h3>
            <p className="text-xs text-gray-400">Enterprise corporate accounts</p>
          </div>
        </div>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
          View Directory (1,290) <span className="ml-1">&gt;</span>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        {companies.map((company) => (
          <div key={company.initials} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                {company.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{company.name}</p>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-400">{company.type} · {company.location} · {company.volume}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{company.amount}</p>
              <p className="text-xs text-gray-400">{company.tier}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-500">99.4% Compliance rate</span>
        </div>
        <button className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors">
          Manage Companies
        </button>
      </div>
    </div>
  );
}
