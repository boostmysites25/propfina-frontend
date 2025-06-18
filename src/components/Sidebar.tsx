import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Menu items array for easy management
  const menuItems = [
    { path: "/dashboard", icon: "fas fa-th-large", label: "Dashboard" },
    { path: "/properties", icon: "fas fa-building", label: "All Properties" },
    {
      path: "/add-property",
      icon: "fas fa-plus-circle",
      label: "Add Property",
    },
    {
      path: "/visits",
      icon: "fas fa-calendar-alt",
      label: "Visits & Scheduling",
    },
    { path: "/users", icon: "fas fa-users", label: "Users" },
    { path: "/banners", icon: "fas fa-image", label: "Customise Banners" },
    { path: "/notifications", icon: "fas fa-bell", label: "Notifications" },
    { path: "/settings", icon: "fas fa-cog", label: "Settings" },
  ];

  // Check if a menu item is active
  const isActive = (path: string) => {
    // Exact match for dashboard, otherwise check if the current path starts with the menu item path
    if (path === "/dashboard") {
      return currentPath === path;
    }
    // For other paths, check if the current path starts with the menu item path
    // This ensures that sub-routes also highlight their parent menu item
    return currentPath.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile - shown when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/30 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 max-h-screen h-full bg-white shadow-sm z-[100] transition-transform duration-300 ease-in-out transform w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:static md:z-10 md:shadow-none`}
      >
        <div className="p-5 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Propfina</h1>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 p-1"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <nav className="mt-5">
          <div className="px-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mt-2 p-3 flex items-center space-x-3 rounded-md cursor-pointer ${
                  isActive(item.path)
                    ? "bg-gray-100 text-gray-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
              >
                <i className={`${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          <button className="mt-2 w-full p-3 flex items-center space-x-3 rounded-md cursor-pointer text-gray-600 hover:bg-gray-100">
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span>Logout</span>
          </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
