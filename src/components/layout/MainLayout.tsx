import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "../../context/AuthContext";
import { Phone } from "lucide-react";

export function MainLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Fixed Floating Action Button (FAB) - Hubungi Admin */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          title="Butuh Bantuan?"
        >
          <Phone className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
            <span className="ml-2 pr-2 font-medium">Hubungi Admin</span>
          </span>
        </button>
      </div>
    </div>
  );
}
