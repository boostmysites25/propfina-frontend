import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import MobileHeader from "./MobileHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header - Only visible on small screens */}
      <div className="flex flex-1">
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="w-full max-h-screen overflow-y-scroll">
          <MobileHeader toggleSidebar={toggleSidebar} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
