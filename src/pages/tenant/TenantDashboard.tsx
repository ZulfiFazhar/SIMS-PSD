import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    FileText,
    Clock,
    Info,
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

function EventCard() {
    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-sm">
            <div className="flex items-center gap-2 mb-12">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-gray-900">Event Mendatang</h3>
            </div>
            <div className="flex items-center justify-center py-24">
                <p className="text-sm text-gray-400">Belum ada informasi</p>
            </div>
        </div>
    );
}

function HelpCard() {
    return (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-sm">
            <h3 className="font-bold text-gray-900 mb-6">Butuh Bantuan?</h3>
            <p className="text-xs text-gray-600 mb-8">
                Waktu Operasional: 07:00 - 15:00
            </p>
            <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                type="button"
            >
                <Phone className="w-4 h-4" />
                Hubungi Admin
            </button>
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
        <div className="w-full">
            <div className="px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Welcome Message */}
                        <h1 className="text-2xl font-bold text-gray-900">
                            Selamat datang, {user.name}
                        </h1>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <div className="bg-white rounded-lg shadow p-6">
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

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Event Mendatang */}
                        <EventCard />

                        {/* Butuh Bantuan */}
                        <HelpCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
