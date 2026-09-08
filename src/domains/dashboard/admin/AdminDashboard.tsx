import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import TotalCompaniesCard from "../components/TotalCompaniesCard";
import PendingApprovalsCard from "../components/PendingApprovalsCard";
import RecentRegistrationsCard from "../components/RecentRegistrationsCard";
import OverviewChart from "../components/OverviewChart";
import ActiveCompaniesCard from "../components/ActiveCompaniesCard";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-20 p-6">
        <TopNav />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Manage companies, approvals, and platform operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TotalCompaniesCard />
          <OverviewChart currentYearValue="$20,000" lastYearValue="$40,000" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PendingApprovalsCard />
          <ActiveCompaniesCard />
        </div>

        <RecentRegistrationsCard />
      </div>
    </div>
  );
}
