import { Link, useLocation } from "react-router-dom";
import { Home, FileText, User } from "lucide-react";

export function Sidebar() {
    const location = useLocation();

    const menuItems = [
        {
            path: "/tenant",
            icon: Home,
            label: "Dashboard",
        },
        {
            path: "/tenant/register",
            icon: FileText,
            label: "Registrasi Startup",
        },
        {
            path: "/tenant/profile",
            icon: User,
            label: "Profil",
        },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <img
                        src="/unikom-logo.png"
                        alt="UNIKOM"
                        className="h-16 w-auto"
                    />
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== "/tenant" && location.pathname.startsWith(item.path));

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">© 2025 UNIKOM</p>
            </div>
        </aside>
    );
}
