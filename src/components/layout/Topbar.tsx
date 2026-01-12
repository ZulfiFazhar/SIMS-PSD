import { useState, useRef, useEffect } from "react";
import { Menu, LogOut, ChevronDown, FileText, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
    title?: string;
    onToggleSidebar?: () => void;
}

export function Topbar({ title = "Panduan Penggunaan", onToggleSidebar }: TopbarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20 relative">
            {/* Left: Hamburger + Title (Clickable) */}
            <div className="flex items-center gap-4">
                <button
                    className="text-gray-600 hover:text-gray-900"
                    type="button"
                    onClick={onToggleSidebar}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Title as Download Link Placeholder */}
                <button
                    className="flex items-center gap-2 group px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                    title="Download Dokumen"
                >
                    <div className="p-1 bg-blue-100 text-blue-600 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {title}
                    </span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </button>
            </div>

            {/* Right: User */}
            <div className="flex items-center gap-4">
                {/* User Info Dropdown */}
                {user && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Keluar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
