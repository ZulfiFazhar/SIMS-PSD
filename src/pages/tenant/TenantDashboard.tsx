import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    FileText,
    Clock,
    Phone,
    ArrowRight
} from "lucide-react";
import type { Startup } from "../../types";

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: string;
}

function InfoCard({ icon, label, value, subtitle }: InfoCardProps) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600 border border-gray-200">{icon}</div>
                <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">{subtitle}</p>
        </div>
    );
}

function StepsList() {
    const steps = [
        {
            number: 1,
            text: "Isi formulir registrasi startup dengan data lengkap"
        },
        {
            number: 2,
            text: "Unggah proposal bisnis startup Anda"
        },
        {
            number: 3,
            text: "Tunggu verifikasi dari admin (3-5 hari kerja)"
        },
        {
            number: 4,
            text: "Mulai mengisi katalog produk"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
                <div key={step.number} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                        {step.number}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{step.text}</p>
                </div>
            ))}
        </div>
    );
}



export function TenantDashboard() {
    const startups = useLoaderData() as Startup[];
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) return null;

    const hasStartup = startups.length > 0;

    return (
        <div className="p-6 max-w-full mx-auto relative min-h-screen pb-24">
            <div className="flex flex-col gap-6">
                {/* Welcome Message */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Selamat datang, {user.name}
                    </h1>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Admin Card */}
                    <InfoCard
                        icon={<User className="w-5 h-5" />}
                        label="Admin"
                        value="Bu Yati Suganto"
                        subtitle="Informasi Admin"
                    />

                    {/* Status Proposal Card */}
                    <InfoCard
                        icon={<FileText className="w-5 h-5" />}
                        label="Status Proposal"
                        value="-"
                        subtitle="Belum ada proposal diupload"
                    />

                    {/* Catatan Card */}
                    <InfoCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Catatan"
                        value="-"
                        subtitle="Belum ada revisi yang diupload"
                    />
                </div>

                {/* Registration Prompt */}
                {!hasStartup && (
                    <div className="bg-white rounded-lg shadow p-6 w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Belum Memulai Registrasi Startup
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Anda belum memulai proses registrasi startup. Untuk mengikuti
                            program Inkubator, silakan isi formulir registrasi startup dan
                            unggah proposal bisnis Anda terlebih dahulu.
                        </p>

                        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <p className="font-bold text-gray-900 mb-4">
                                Langkah-langkah yang harus Anda lakukan:
                            </p>
                            <StepsList />
                        </div>

                        <button
                            onClick={() => navigate("/tenant/register")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                            type="button"
                        >
                            Mulai Registrasi Startup
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Fixed Floating Action Button (FAB) */}
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
