import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import DashboardFooter from "./DashboardFooter";
import { Toaster } from "react-hot-toast";
const DashboardMain = () => {
  return (
    <div>
      <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      <div className="d-flex">
        <DashboardSidebar />

        <div className="flex-grow-1 mt-3 d-flex flex-column min-vh-100">
          <DashboardTopbar />

          <main className="flex-grow-1 bg-light p-4">
            <Outlet />
          </main>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
