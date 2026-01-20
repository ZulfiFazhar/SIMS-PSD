import {
    Building2,
    FileText,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Download
} from "lucide-react";

export interface TenantData {
    id: string;
    user_id: string;
    nama_ketua_tim: string;
    nim_nidn_ketua: string;
    nama_anggota_tim: string; // JSON string array
    nim_nidn_anggota: string; // JSON string array
    nomor_telepon: string;
    fakultas: string;
    prodi: string;
    nama_bisnis: string;
    kategori_bisnis: string;
    alamat_usaha: string;
    jenis_usaha: string;
    lama_usaha: number;
    omzet: string;
    status: "pending" | "approved" | "rejected";
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    business_documents: {
        id: number;
        tenant_id: string;
        logo_url: string;
        akun_medsos: string; // JSON string object
        sertifikat_nib_url: string;
        proposal_url: string;
        bmc_url: string;
        rab_url: string;
        laporan_keuangan_url: string;
        foto_produk_urls: string; // JSON string array
        created_at: string;
        updated_at: string;
    };
}

interface TenantRegistrationDetailProps {
    data: TenantData;
    hideHeader?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "approved":
            return (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    Disetujui
                </div>
            );
        case "rejected":
            return (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium">
                    <XCircle className="w-5 h-5" />
                    Ditolak
                </div>
            );
        default:
            return (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                    <Clock className="w-5 h-5" />
                    Menunggu Verifikasi
                </div>
            );
    }
};

const DocumentLink = ({ url, label }: { url: string; label: string }) => {
    if (!url) return <span className="text-gray-400 text-sm">Tidak ada file</span>;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium p-3 bg-blue-50 rounded-lg border border-blue-100 transition-colors"
        >
            <FileText className="w-4 h-4" />
            {label}
            <Download className="w-3 h-3 ml-auto" />
        </a>
    );
};

export function TenantRegistrationDetail({ data, hideHeader = false }: TenantRegistrationDetailProps) {
    // Helper to parse JSON safely
    const parseJSON = <T,>(str: string, fallback: T): T => {
        try {
            return JSON.parse(str);
        } catch {
            return fallback;
        }
    };

    const teamMembers = parseJSON(data.nama_anggota_tim, []);
    const teamNims = parseJSON(data.nim_nidn_anggota, []);
    const socialMedia = parseJSON(data.business_documents?.akun_medsos || "{}", {} as { instagram?: string; tiktok?: string });
    const productPhotos = parseJSON(data.business_documents?.foto_produk_urls || "[]", []);

    return (
        <div className="max-w-full mx-auto space-y-8 pb-20 p-6">
            {/* Status Header */}
            {!hideHeader && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Status Pendaftaran</h1>
                            <p className="text-gray-500 mt-1">Tenant ID: {data.id}</p>
                        </div>
                        <StatusBadge status={data.status} />
                    </div>

                    {data.status === 'rejected' && data.rejection_reason && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-900 mb-1">Alasan Penolakan:</h3>
                            <p className="text-red-700">{data.rejection_reason}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Profile Bisnis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Profil Bisnis</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 col-span-2">
                        {data.business_documents?.logo_url && (
                            <img
                                src={data.business_documents.logo_url}
                                alt="Logo"
                                className="w-24 h-24 rounded-lg object-contain border border-gray-200 bg-gray-50"
                            />
                        )}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{data.nama_bisnis}</h3>
                            <p className="text-gray-500 text-sm mt-1">{data.kategori_bisnis} • {data.jenis_usaha}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Alamat Usaha</label>
                        <p className="mt-1 text-gray-900 font-medium">{data.alamat_usaha}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Lama Usaha</label>
                        <p className="mt-1 text-gray-900 font-medium">{data.lama_usaha} Bulan</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Omzet/Bulan</label>
                        <p className="mt-1 text-gray-900 font-medium">Rp {parseFloat(data.omzet).toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Social Media</label>
                        <div className="mt-1 space-y-1">
                            {socialMedia.instagram && (
                                <p className="text-sm text-gray-900">IG: @{socialMedia.instagram}</p>
                            )}
                            {socialMedia.tiktok && (
                                <p className="text-sm text-gray-900">TikTok: @{socialMedia.tiktok}</p>
                            )}
                            {!socialMedia.instagram && !socialMedia.tiktok && (
                                <span className="text-gray-400 text-sm">-</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tim */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Users className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Tim & Anggota</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Ketua Tim</label>
                            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                <p className="font-semibold text-gray-900">{data.nama_ketua_tim}</p>
                                <p className="text-sm text-gray-500">NIM: {data.nim_nidn_ketua}</p>
                                <p className="text-sm text-gray-500">{data.nomor_telepon}</p>
                                <p className="text-sm text-gray-500 mt-1">{data.prodi} - {data.fakultas}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Anggota Tim</label>
                            <div className="space-y-3">
                                {teamMembers.map((member: string, idx: number) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="font-medium text-gray-900">{member}</p>
                                        <p className="text-sm text-gray-500">NIM: {teamNims[idx] || '-'}</p>
                                    </div>
                                ))}
                                {teamMembers.length === 0 && <p className="text-gray-400 text-sm">Tidak ada anggota tambahan</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dokumen */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Dokumen & Berkas</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DocumentLink url={data.business_documents?.sertifikat_nib_url} label="Sertifikat NIB" />
                        <DocumentLink url={data.business_documents?.proposal_url} label="Proposal Bisnis" />
                        <DocumentLink url={data.business_documents?.bmc_url} label="Business Model Canvas" />
                        <DocumentLink url={data.business_documents?.rab_url} label="RAB" />
                        <DocumentLink url={data.business_documents?.laporan_keuangan_url} label="Laporan Keuangan" />
                    </div>

                    {productPhotos.length > 0 && (
                        <div className="mt-8">
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-3">Foto Produk</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {productPhotos.map((url: string, idx: number) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                        <img src={url} alt={`Produk ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
