import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { tenantService } from "../../services/tenantService";
import { authService } from "../../services/authService";
import {
    FileText,
    Clock,
    ArrowRight,
    Loader2
} from "lucide-react";
import type { TenantData } from "./TenantRegistrationDetail";

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
            text: "Proposal disetujui admin dan berhasil membuat akun tenant"
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
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [registeredTenant, setRegisteredTenant] = useState<TenantData | null>(null);

    // Check for existing registration
    useEffect(() => {
        const checkRegistration = async () => {
            try {
                const idToken = await authService.getValidToken();
                const data = await tenantService.getTenantRegistration(idToken);
                if (data) {
                    setRegisteredTenant(data);
                }
            } catch (error) {
                console.error("Failed to check registration", error);
            } finally {
                setIsCheckingRegistration(false);
            }
        };
        checkRegistration();
    }, []);

    const hasStartup = registeredTenant !== null;

    if (!user) return null;

    if (isCheckingRegistration) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Memeriksa status pendaftaran...</p>
                </div>
            </div>
        );
    }

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tanggal Bergabung Card */}
                    {registeredTenant && (
                        <InfoCard
                            icon={<Clock className="w-5 h-5" />}
                            label="Terdaftar Sejak"
                            value={new Date(registeredTenant.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                            subtitle={(() => {
                                const days = Math.floor((Date.now() - new Date(registeredTenant.created_at).getTime()) / (1000 * 60 * 60 * 24));
                                return `${days} hari yang lalu`;
                            })()}
                        />
                    )}

                    {/* Kelengkapan Dokumen Card */}
                    {registeredTenant && (
                        <InfoCard
                            icon={<FileText className="w-5 h-5" />}
                            label="Kelengkapan Dokumen"
                            value={(() => {
                                const docs = registeredTenant.business_documents;
                                if (!docs) return "0/6";
                                const totalFiles = 6; // proposal, bmc, nib, laporan keuangan, rab, logo
                                const uploadedFiles = [
                                    docs.proposal_url,
                                    docs.bmc_url,
                                    docs.sertifikat_nib_url,
                                    docs.laporan_keuangan_url,
                                    docs.rab_url,
                                    docs.logo_url
                                ].filter(Boolean).length;
                                return `${uploadedFiles}/${totalFiles}`;
                            })()}
                            subtitle={(() => {
                                const docs = registeredTenant.business_documents;
                                if (!docs) return "Belum ada dokumen";
                                const totalFiles = 6;
                                const uploadedFiles = [
                                    docs.proposal_url,
                                    docs.bmc_url,
                                    docs.sertifikat_nib_url,
                                    docs.laporan_keuangan_url,
                                    docs.rab_url,
                                    docs.logo_url
                                ].filter(Boolean).length;
                                return uploadedFiles === totalFiles ? "Semua dokumen lengkap" : `${totalFiles - uploadedFiles} dokumen belum diupload`;
                            })()}
                        />
                    )}
                </div>

                {/* Registration Status */}
                {!hasStartup ? (
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
                ) : (
                    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden w-full">
                        {/* Header Banner - Dynamic based on status */}
                        {registeredTenant?.status === 'approved' ? (
                            <div className="bg-green-50 rounded-t-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 text-green-500">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Proposal Disetujui
                                        </h2>
                                        <p className="text-sm text-gray-700">
                                            Selamat! Proposal Anda telah disetujui oleh admin. Anda dapat mulai mengisi katalog produk.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : registeredTenant?.status === 'rejected' ? (
                            <div className="bg-red-50 rounded-t-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 text-red-500">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Proposal Ditolak
                                        </h2>
                                        <p className="text-sm text-gray-700">
                                            Mohon maaf, proposal Anda tidak disetujui oleh admin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-50 rounded-t-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 text-blue-500">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Menunggu Review Admin
                                        </h2>
                                        <p className="text-sm text-gray-700">
                                            Proposal Anda sedang menunggu review dari admin. Proses ini memakan waktu 3-5 hari kerja.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tahapan Proses */}
                        <div className="p-8">
                            <h3 className="font-bold text-gray-900 mb-6">Tahapan Proses</h3>
                            <div className="relative">
                                {/* Step 1: Proposal Disubmit - Always completed */}
                                <div className="flex items-start gap-4 relative pb-8">
                                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h4 className="font-semibold text-green-600 mb-0.5">Proposal Disubmit</h4>
                                        <p className="text-sm text-gray-600">Proposal telah berhasil diunggah</p>
                                    </div>
                                </div>

                                {/* Step 2: Penilaian Sistem dan Review Admin */}
                                <div className="flex items-start gap-4 relative pb-8">
                                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                                    {registeredTenant?.status === 'approved' ? (
                                        <>
                                            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h4 className="font-semibold text-green-600 mb-0.5">Review Admin</h4>
                                                <p className="text-sm text-gray-600">Review admin selesai</p>
                                            </div>
                                        </>
                                    ) : registeredTenant?.status === 'rejected' ? (
                                        <>
                                            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center relative z-10">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h4 className="font-semibold text-red-600 mb-0.5">Review Admin</h4>
                                                <p className="text-sm text-gray-600">Review admin selesai</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
                                                <span className="text-white font-bold text-base">2</span>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h4 className="font-semibold text-blue-600 mb-0.5">Review Admin</h4>
                                                <p className="text-sm text-gray-600">Admin sedang meninjau proposal Anda</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Step 3: Proposal Disetujui */}
                                <div className="flex items-start gap-4 relative">
                                    {registeredTenant?.status === 'approved' ? (
                                        <>
                                            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h4 className="font-semibold text-green-600 mb-0.5">Proposal Disetujui</h4>
                                                <p className="text-sm text-gray-600">Proposal telah disetujui</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center relative z-10">
                                                <span className="text-gray-500 font-bold text-base">3</span>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h4 className="font-semibold text-gray-500 mb-0.5">Proposal Disetujui</h4>
                                                <p className="text-sm text-gray-500">Menunggu keputusan akhir</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Catatan Revisi Card - Separate card, only shown when rejected */}
                {hasStartup && registeredTenant?.status === 'rejected' && (
                    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden w-full">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Catatan Revisi dari Admin</h2>
                                <p className="text-sm text-gray-500">Silakan perbaiki hal-hal berikut sebelum mengajukan kembali</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="prose prose-sm max-w-none">
                                    {registeredTenant?.rejection_reason ? (
                                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {registeredTenant.rejection_reason}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Tidak ada catatan revisi yang diberikan</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-gray-700">
                                    <strong className="text-gray-900">Catatan:</strong> Anda dapat mengajukan ulang proposal setelah melakukan perbaikan sesuai dengan catatan di atas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
