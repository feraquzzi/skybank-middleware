import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import VendorStatsCard from "../components/VendorStatsCard";
import APITrafficCard from "../components/APITrafficCard";
import AvailableServices from "../components/AvailableServices";
import { getDisplayName } from "../../../lib/user";

export default function VendorDashboard() {
  const displayName = getDisplayName();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <Sidebar />

      <div className="ml-20 pt-24 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {displayName} !</h1>
            <p className="text-sm text-gray-500 mt-1">Vendor Operations & API Services Hub</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-gray-700">Live Production API</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">v2.4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <VendorStatsCard
            title="TOTAL API REQUESTS"
            value="2.84M"
            change="+18.4%"
            changeColor="green"
            icon={
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            footerLeft="99.98% Success Rate"
            footerRight="Optimal"
            footerRightColor="green"
          />
          <VendorStatsCard
            title="SETTLED VOLUME"
            value="$4.92M"
            change="+12.1%"
            changeColor="green"
            icon={
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            footerLeft="Avg. settlement: 1.2s"
            footerRight="T+0 instant"
            footerRightColor="green"
          />
          <VendorStatsCard
            title="ACTIVE CUSTOMERS"
            value="84,320"
            change="+2,410 new"
            changeColor="blue"
            icon={
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            footerLeft="Across 14 regions"
            footerRight="Multi-KYC"
            footerRightColor="green"
          />
          <VendorStatsCard
            title="ESCROW BALANCE"
            value="$385,400"
            icon={
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            footerLeft="Next payout 09:00 AM"
            footerRight="Top-up →"
            footerRightColor="orange"
          />
        </div>

        <div className="mb-6">
          <APITrafficCard />
        </div>

        <AvailableServices />

        <footer className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>Sky Bank Sierra Leone Limited · Authorized by Bank of Sierra Leone</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-600">API Documentation</a>
            <a href="#" className="hover:text-gray-600">Developer Sandbox</a>
            <a href="#" className="hover:text-gray-600">Security & Compliance</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
