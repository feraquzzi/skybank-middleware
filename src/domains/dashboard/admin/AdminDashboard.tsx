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

const tabs = ["Dashboard", "Transaction", "Invoicing", "Report", "Analytics"];

const stats = [
  { title: "Monthly Revenue", value: "$ 28,212.92", change: -2.8 },
  { title: "Monthly Sales", value: "$ 28,212.92", change: -2.8 },
  { title: "Total Profit", value: "$ 28,212.92", change: -2.8 },
];

const transactions = [
  { company: "Meta Platform Inc.", amount: "$29.00", status: "Order Successful", icon: "M", iconBg: "bg-blue-500" },
  { company: "Spotify Ltd.", amount: "$12.00", status: "Order Successful", icon: "S", iconBg: "bg-green-500" },
  { company: "Amazon Inc.", amount: "$39.00", status: "Order Successful", icon: "A", iconBg: "bg-orange-500" },
  { company: "Apple Inc.", amount: "$102.00", status: "Order Successful", icon: "A", iconBg: "bg-gray-900" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <TopNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notifications={12}
          userName="Liona Horan"
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
                Full Statistic
              </button>
              <button className="px-5 py-2.5 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors">
                Result Summary
              </button>
              <button className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TeamPaymentsCard title="Team Payments" date="17th Nov 2023" memberCount={20} />
              <IncomeStatsCard title="Income Statistics" change={12.9} bars={[30, 55, 45, 70, 60, 80, 65]} />
              <PricingCard price="$29.9" period="Per Month" title="Choose Best Plan for You!" buttonText="Upgrade Now" />
            </div>

            <SalesChartCard
              title="Total Sales and Cost"
              date="17th Nov 2023"
              totalProfit="$28k"
              netValue="$12k"
              totalCost="$13k"
              invested="3 Invested"
              chartData={[40, 55, 45, 70, 60, 80, 65, 50, 75, 60]}
              tooltipValue="$65.00"
            />
          </div>

          <div className="space-y-6">
            <WarningCard
              title="Submit Tax Information"
              description="Receive tax documents and distributions promptly and efficiently."
            />

            <ParticipantCard
              title="Participant"
              description="Strategic onboarding: Shaping new signups into a community of accomplished, successful users."
              memberCount={124}
            />

            <TransactionsCard title="Last Transactions" transactions={transactions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
