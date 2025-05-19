
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/95 dark">
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header openMobileSidebar={openMobileSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-transparent to-black/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
