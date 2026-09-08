import { useState } from "react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Create Customer",
    description: "Instantly provision corporate or retail customer wallets and accounts via streamlined KYC flow.",
    method: "POST",
    endpoint: "/v2/customers",
    buttonText: "Launch Service",
    buttonColor: "orange" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    title: "Check Balance",
    description: "Real-time ledger inquiry across multi-currency escrow, reserve accounts, and sub-wallets.",
    method: "GET",
    endpoint: "/v2/ledger/bal",
    buttonText: "Test Query",
    buttonColor: "gray" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: "Disbursement & Payouts",
    description: "Automate batch payouts and bulk settlements to local Sierra Leone clearing and SWIFT partner banks.",
    method: "POST",
    endpoint: "/v2/payouts",
    buttonText: "Initiate Payout",
    buttonColor: "orange" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Virtual Card Issuance",
    description: "Generate virtual Visa & Mastercard debit cards with programmable spend limits and freeze controls.",
    method: "POST",
    endpoint: "/v2/cards/issue",
    buttonText: "Manage Cards",
    buttonColor: "gray" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: "KYC & Identity Verification",
    description: "Automate National ID, passport, and biometric verification workflows with instant AML/CFT scoring.",
    method: "POST",
    endpoint: "/v2/identity/check",
    buttonText: "Verify ID",
    buttonColor: "gray" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Smart Invoicing & Billing",
    description: "Create dynamic payment links, recurring billing cycles, and automated tax compliant invoices.",
    method: "POST",
    endpoint: "/v2/invoices",
    buttonText: "Generate Link",
    buttonColor: "gray" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
  {
    title: "Currency Exchange & FX",
    description: "Lock in live institutional FX rates and convert seamlessly between USD, EUR, GBP, and Sierra Leone SLE.",
    method: "POST",
    endpoint: "/v2/fx/convert",
    buttonText: "Exchange",
    buttonColor: "gray" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: "Webhook & Event Stream",
    description: "Subscribe to real-time webhook push events for instant settlement notifications and state machine triggers.",
    method: "LISTEN",
    endpoint: "/v2/events",
    buttonText: "Configure Hooks",
    buttonColor: "gray" as const,
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const tabs = ["All (8)", "Account Services", "Payments & Transfers", "Verification"];

export default function AvailableServices() {
  const [activeTab, setActiveTab] = useState("All (8)");

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">Available Services</h3>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
              8 Active
            </span>
          </div>
          <p className="text-xs text-gray-400">Core banking and orchestration services provisioned for your vendor credentials</p>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  );
}
