import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
    title?: string;
    onToggleSidebar?: () => void;
}

export function Topbar({ title = "Panduan Penggunaan", onToggleSidebar }: TopbarProps) {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
            {/* Left: Hamburger + Title */}
            <div className="flex items-center gap-4">
                <button
                    className="text-gray-600 hover:text-gray-900"
                    type="button"
                    onClick={onToggleSidebar}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-medium text-gray-900">{title}</h1>
            </div>

            {/* Right: Notification + User */}
            <div className="flex items-center gap-4">
                {/* Notification */}
                <button
                    className="relative text-gray-600 hover:text-gray-900"
                    type="button"
                >
                    <Bell className="w-6 h-6" />
                    {/* Notification badge (optional) */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Info */}
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
