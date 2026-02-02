import { X, User, Building2, Phone, Calendar, Users, MapPin, TrendingUp, DollarSign } from "lucide-react";
import type { TenantRegistration } from "../../types";

interface TenantDetailModalProps {
    tenant: TenantRegistration;
    onClose: () => void;
}

export function TenantDetailModal({ tenant, onClose }: TenantDetailModalProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value: string) => {
        const num = parseFloat(value);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };


    const parseJsonArray = (jsonString: string): string[] => {
        try {
            const parsed = JSON.parse(jsonString);
            return parsed ?? [];
        } catch {
            return [];
        }
    };

    const anggotaTim = parseJsonArray(tenant.nama_anggota_tim);
    const nimAnggota = parseJsonArray(tenant.nim_nidn_anggota);

    const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        approved: "bg-green-100 text-green-800 border-green-300",
        rejected: "bg-red-100 text-red-800 border-red-300",
    };

    const statusLabels = {
        pending: "Menunggu Validasi",
        approved: "Disetujui",
        rejected: "Ditolak",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-900/35 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Detail Tenant</h3>
                        <p className="text-sm text-gray-600 mt-1">{tenant.nama_bisnis}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusStyles[tenant.status]}`}>
                            {statusLabels[tenant.status]}
                        </span>
                        {tenant.rejection_reason && (
                            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm font-semibold text-red-900 mb-1">Alasan Penolakan:</p>
                                <p className="text-sm text-red-700">{tenant.rejection_reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Information Sections */}
                    <div className="space-y-6">
                        {/* Informasi Ketua Tim */}
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                <User className="w-5 h-5 text-blue-600" />
                                Informasi Ketua Tim
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                                    <p className="font-medium text-gray-900">{tenant.nama_ketua_tim}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">NIM/NIDN</p>
                                    <p className="font-medium text-gray-900">{tenant.nim_nidn_ketua}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Fakultas</p>
                                    <p className="font-medium text-gray-900">{tenant.fakultas}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Program Studi</p>
                                    <p className="font-medium text-gray-900">{tenant.prodi}</p>
                                </div>
                            </div>
                        </div>


                        {/* Anggota Tim */}
                        {anggotaTim && anggotaTim.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    Anggota Tim
                                </h3>
                                <div className="space-y-3">
                                    {anggotaTim.map((nama, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900">{nama}</p>
                                                <p className="text-sm text-gray-600">NIM/NIDN: {nimAnggota[index] || '-'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Informasi Bisnis */}
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Informasi Bisnis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Kategori Bisnis</p>
                                    <p className="font-medium text-gray-900">{tenant.kategori_bisnis}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Jenis Usaha</p>
                                    <p className="font-medium text-gray-900">{tenant.jenis_usaha}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Alamat Usaha
                                    </p>
                                    <p className="font-medium text-gray-900">{tenant.alamat_usaha}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        Nomor Telepon
                                    </p>
                                    <p className="font-medium text-gray-900">{tenant.nomor_telepon}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Lama Usaha
                                    </p>
                                    <p className="font-medium text-gray-900">{tenant.lama_usaha} bulan</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        Omzet Per Bulan
                                    </p>
                                    <p className="font-medium text-gray-900 text-lg text-green-600">
                                        {formatCurrency(tenant.omzet)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Timeline
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tanggal Pendaftaran</p>
                                        <p className="font-medium text-gray-900">{formatDate(tenant.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                                        <p className="font-medium text-gray-900">{formatDate(tenant.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
