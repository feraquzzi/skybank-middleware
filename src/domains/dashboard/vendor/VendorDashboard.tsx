import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TopNav from "../components/TopNav";
import StatCard from "../components/StatCard";
import WarningCard from "../components/WarningCard";
import TeamPaymentsCard from "../components/TeamPaymentsCard";
import IncomeStatsCard from "../components/IncomeStatsCard";
import PricingCard from "../components/PricingCard";
import ParticipantCard from "../components/ParticipantCard";
import TransactionsCard from "../components/TransactionsCard";
import SalesChartCard from "../components/SalesChartCard";

const tabs = ["Dashboard", "Orders", "Products", "Analytics", "Settings"];

const stats = [
  { title: "Total Revenue", value: "$ 15,432.00", change: 5.2 },
  { title: "Pending Orders", value: "$ 3,210.50", change: -1.5 },
  { title: "Completed Sales", value: "$ 12,221.50", change: 8.3 },
];

const transactions = [
  { company: "Google LLC", amount: "$156.00", status: "Payment Received", icon: "G", iconBg: "bg-red-500" },
  { company: "Microsoft Corp.", amount: "$89.00", status: "Payment Received", icon: "M", iconBg: "bg-blue-600" },
  { company: "Netflix Inc.", amount: "$45.00", status: "Pending", icon: "N", iconBg: "bg-red-600" },
  { company: "Tesla Inc.", amount: "$210.00", status: "Payment Received", icon: "T", iconBg: "bg-gray-900" },
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <TopNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notifications={8}
          userName="Sarah Johnson"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full">
                Sales Overview
              </button>
              <button className="px-5 py-2.5 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors">
                Revenue Summary
              </button>
              <button className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TeamPaymentsCard title="Product Sales" date="15th Nov 2023" memberCount={15} />
              <IncomeStatsCard title="Revenue Growth" change={8.5} bars={[25, 40, 55, 50, 65, 75, 60]} />
              <PricingCard price="$19.9" period="Per Month" title="Upgrade Your Vendor Plan!" buttonText="Get Started" />
            </div>

            <SalesChartCard
              title="Monthly Revenue Breakdown"
              date="15th Nov 2023"
              totalProfit="$18k"
              netValue="$8k"
              totalCost="$10k"
              invested="2 Invested"
              chartData={[35, 50, 40, 65, 55, 70, 58, 45, 68, 55]}
              tooltipValue="$52.00"
            />
          </div>

          <div className="space-y-6">
            <WarningCard
              title="Complete Verification"
              description="Verify your vendor account to access all features."
            />

            <ParticipantCard
              title="Your Customers"
              description="Building relationships with your customers through excellent service."
              memberCount={89}
            />

            <TransactionsCard title="Recent Sales" transactions={transactions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
