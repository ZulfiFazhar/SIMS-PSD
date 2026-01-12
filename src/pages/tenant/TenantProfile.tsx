import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { Loader2, AlertCircle } from "lucide-react";

interface UserProfile {
    id: string;
    firebase_uid: string;
    email: string;
    display_name: string;
    photo_url: string | null;
    phone_number: string | null;
    role: string;
    is_active: boolean;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
}

export function TenantProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Form state for editable fields
    const [formData, setFormData] = useState({
        display_name: "",
        email: "",
        phone_number: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const profile = await authService.getCurrentUserProfile();
            setUserProfile(profile);
            setFormData({
                display_name: profile.display_name || "",
                email: profile.email || "",
                phone_number: profile.phone_number || "",
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat profil";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSave = () => {
        // TODO: Implement update profile API call
        setIsEditing(false);
    };

    if (!user) return null;

    if (isLoading) {
        return (
            <div className="p-6 max-w-full mx-auto pb-20">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600">Memuat profil...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-full mx-auto pb-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div>
                            <h3 className="font-semibold text-red-900">Gagal Memuat Profil</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={loadProfile}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-full mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi profil dan data pribadi Anda</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="p-8 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        {userProfile?.photo_url ? (
                            <img
                                src={userProfile.photo_url}
                                alt={formData.display_name}
                                className="w-20 h-20 rounded-full shadow-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {getInitials(formData.display_name)}
                            </div>
                        )}

                        {/* Name & Email */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{formData.display_name}</h2>
                            <p className="text-gray-500 mt-1">{formData.email}</p>
                            {userProfile?.email_verified && (
                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                    ✓ Email Terverifikasi
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Edit Button */}
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            type="button"
                        >
                            Edit Profil
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    // Reset form data
                                    if (userProfile) {
                                        setFormData({
                                            display_name: userProfile.display_name || "",
                                            email: userProfile.email || "",
                                            phone_number: userProfile.phone_number || "",
                                        });
                                    }
                                }}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                type="button"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                type="button"
                            >
                                Simpan
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Informasi Pribadi</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                disabled={!isEditing}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled={true}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 outline-none cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
                        </div>

                        {/* Nomor Telepon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                value={formData.phone_number || ""}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Belum diisi"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>

                        {/* Role (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <input
                                type="text"
                                value={userProfile?.role || "-"}
                                disabled={true}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 outline-none capitalize cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
