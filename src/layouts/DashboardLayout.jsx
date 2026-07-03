import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;