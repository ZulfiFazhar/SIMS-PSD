import { useState } from "react";
import { Search, ChevronDown, Eye, Power } from "lucide-react";
import type { TenantRegistration, TenantRegistrationStatus } from "../../types";
import { TenantRegistrationStatus as StatusEnum } from "../../types";
import { StatusUpdateDialog } from "../../components/admin/StatusUpdateDialog";
import { FilePreviewModal } from "../../components/admin/FilePreviewModal";

// Reuse mock data from AdminDashboard
const mockTenants: TenantRegistration[] = [
    {
        id: "1",
        nama_bisnis: "Warung Kopi Digital",
        nama_ketua_tim: "Budi Santoso",
        nim_nidn_ketua: "41520001",
        fakultas: "Teknik & Ilmu Komputer",
        prodi: "Teknik Informatika",
        kategori_bisnis: "Kuliner & F&B",
        jenis_usaha: "Offline",
        alamat_usaha: "Jl. Dipatiukur No. 112-116, Bandung",
        nomor_telepon: "081234567890",
        lama_usaha: 6,
        omzet: 15000000,
        status: StatusEnum.PENDING,
        created_at: "2026-01-05T08:30:00",
        updated_at: "2026-01-05T08:30:00",
        files: {
            logo: "/uploads/logo1.png",
            proposal: "/uploads/proposal1.pdf",
            bmc: "/uploads/bmc1.pdf",
        }
    },
    {
        id: "2",
        nama_bisnis: "TechStart Indonesia",
        nama_ketua_tim: "Siti Nurhaliza",
        nim_nidn_ketua: "41520010",
        fakultas: "Teknik & Ilmu Komputer",
        prodi: "Sistem Informasi",
        kategori_bisnis: "Teknologi & Digital",
        jenis_usaha: "Online",
        alamat_usaha: "Jl. Setiabudi No. 229, Bandung",
        nomor_telepon: "082345678901",
        status: StatusEnum.PENDING,
        created_at: "2026-01-06T10:15:00",
        updated_at: "2026-01-06T10:15:00",
    },
    {
        id: "3",
        nama_bisnis: "Fashion EveryDay",
        nama_ketua_tim: "Ahmad Hidayat",
        nim_nidn_ketua: "41520025",
        fakultas: "Desain",
        prodi: "Desain Komunikasi Visual",
        kategori_bisnis: "Fashion & Kreatif",
        jenis_usaha: "Hybrid",
        alamat_usaha: "Jl. Terusan Buah Batu, Bandung",
        nomor_telepon: "083456789012",
        lama_usaha: 12,
        omzet: 25000000,
        status: StatusEnum.APPROVED,
        created_at: "2025-12-20T14:20:00",
        updated_at: "2026-01-08T09:00:00",
    },
    {
        id: "4",
        nama_bisnis: "Agro Fresh Market",
        nama_ketua_tim: "Dewi Lestari",
        nim_nidn_ketua: "41520033",
        fakultas: "Ekonomi",
        prodi: "Manajemen",
        kategori_bisnis: "Agribisnis",
        jenis_usaha: "Offline",
        alamat_usaha: "Jl. Soekarno Hatta No. 590, Bandung",
        nomor_telepon: "084567890123",
        status: StatusEnum.REJECTED,
        created_at: "2025-12-15T16:45:00",
        updated_at: "2026-01-03T11:30:00",
        rejection_reason: "Proposal kurang detail pada bagian analisis pasar. Mohon tambahkan data kompetitor dan strategi marketing yang lebih spesifik."
    },
    {
        id: "5",
        nama_bisnis: "EduTech Solutions",
        nama_ketua_tim: "Rian Firmansyah",
        nim_nidn_ketua: "41520042",
        fakultas: "Teknik & Ilmu Komputer",
        prodi: "Teknik Informatika",
        kategori_bisnis: "Teknologi & Digital",
        jenis_usaha: "Online",
        alamat_usaha: "Jl. Cikutra No. 204, Bandung",
        nomor_telepon: "085678901234",
        status: StatusEnum.PENDING,
        created_at: "2026-01-07T09:00:00",
        updated_at: "2026-01-07T09:00:00",
    },
    {
        id: "6",
        nama_bisnis: "Jasa Event Organizer Pro",
        nama_ketua_tim: "Maya Kusuma",
        nim_nidn_ketua: "41520051",
        fakultas: "Ilmu Komunikasi",
        prodi: "Public Relations",
        kategori_bisnis: "Jasa & Pelayanan",
        jenis_usaha: "Offline",
        alamat_usaha: "Jl. Pasteur No. 65, Bandung",
        nomor_telepon: "086789012345",
        status: StatusEnum.PENDING,
        created_at: "2026-01-08T13:20:00",
        updated_at: "2026-01-08T13:20:00",
    },
];

export function AdminTenants() {
    const [tenants] = useState<TenantRegistration[]>(mockTenants);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedTenant, setSelectedTenant] = useState<TenantRegistration | null>(null);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [showFilePreview, setShowFilePreview] = useState(false);
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

    // Filter tenants based on search and status
    const filteredTenants = tenants.filter((tenant) => {
        const matchesSearch =
            tenant.nama_bisnis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tenant.nama_ketua_tim.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tenant.nim_nidn_ketua.includes(searchQuery);

        const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (tenant: TenantRegistration, newStatus: TenantRegistrationStatus) => {
        setSelectedTenant({ ...tenant, status: newStatus });
        setShowStatusDialog(true);
    };

    const handleViewFiles = (tenant: TenantRegistration) => {
        setSelectedTenant(tenant);
        setShowFilePreview(true);
    };

    const handleDeactivateAccount = (tenant: TenantRegistration) => {
        setSelectedTenant(tenant);
        setShowDeactivateDialog(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getStatusBadge = (status: TenantRegistrationStatus) => {
        const styles = {
            [StatusEnum.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
            [StatusEnum.APPROVED]: "bg-green-100 text-green-800 border-green-200",
            [StatusEnum.REJECTED]: "bg-red-100 text-red-800 border-red-200",
        };
        const labels = {
            [StatusEnum.PENDING]: "Pending",
            [StatusEnum.APPROVED]: "Disetujui",
            [StatusEnum.REJECTED]: "Ditolak",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <div className="p-6 max-w-full mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Kelola Tenant</h1>
                <p className="text-sm text-gray-600 mt-1">Kelola semua akun tenant dan status pendaftaran</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama bisnis, ketua tim, atau NIM..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value={StatusEnum.PENDING}>Pending</option>
                            <option value={StatusEnum.APPROVED}>Disetujui</option>
                            <option value={StatusEnum.REJECTED}>Ditolak</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                    Menampilkan <span className="font-semibold text-gray-900">{filteredTenants.length}</span> dari {tenants.length} tenant
                </div>
            </div>

            {/* Tenants Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bisnis</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua Tim</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fakultas / Prodi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubah Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelola Akun</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-6 py-12 text-center">
                                        <p className="text-gray-500">Tidak ada tenant ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant, index) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{tenant.nama_bisnis}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{tenant.nama_ketua_tim}</div>
                                            <div className="text-xs text-gray-500">{tenant.nim_nidn_ketua}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {tenant.nomor_telepon}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{tenant.fakultas}</div>
                                            <div className="text-xs text-gray-500">{tenant.prodi}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {tenant.kategori_bisnis}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(tenant.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(tenant.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="relative inline-block">
                                                <select
                                                    value={tenant.status}
                                                    onChange={(e) => handleStatusChange(tenant, e.target.value as TenantRegistrationStatus)}
                                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-gray-400 transition-colors"
                                                >
                                                    <option value={StatusEnum.PENDING}>Pending</option>
                                                    <option value={StatusEnum.APPROVED}>Setujui</option>
                                                    <option value={StatusEnum.REJECTED}>Tolak</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeactivateAccount(tenant)}
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                                                title="Deactivate Account"
                                            >
                                                <Power className="w-4 h-4" />
                                                Deactivate
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewFiles(tenant)}
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Update Dialog */}
            {showStatusDialog && selectedTenant && (
                <StatusUpdateDialog
                    tenant={selectedTenant}
                    newStatus={selectedTenant.status}
                    onClose={() => setShowStatusDialog(false)}
                    onConfirm={(rejectionReason) => {
                        console.log('Status updated:', {
                            tenantId: selectedTenant.id,
                            newStatus: selectedTenant.status,
                            rejectionReason
                        });
                        alert(`Status berhasil diubah!\n${rejectionReason ? `Alasan: ${rejectionReason}` : ''}`);
                        setShowStatusDialog(false);
                    }}
                />
            )}

            {/* File Preview Modal */}
            {showFilePreview && selectedTenant && (
                <FilePreviewModal
                    tenant={selectedTenant}
                    onClose={() => setShowFilePreview(false)}
                />
            )}

            {/* Deactivate Account Dialog */}
            {showDeactivateDialog && selectedTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/35 backdrop-blur-sm"
                        onClick={() => setShowDeactivateDialog(false)}
                    />
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                            <h3 className="text-lg font-semibold text-gray-900">Deactivate Account</h3>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-sm text-gray-600 mb-3">
                                Apakah Anda yakin ingin menonaktifkan akun tenant ini?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="text-sm font-medium text-gray-900">{selectedTenant.nama_bisnis}</p>
                                <p className="text-xs text-gray-600">{selectedTenant.nama_ketua_tim}</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800">
                                    <strong>Peringatan:</strong> Akun yang dinonaktifkan tidak dapat login ke sistem.
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDeactivateDialog(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Deactivate account:', selectedTenant.id);
                                    alert('Akun berhasil dinonaktifkan! (Placeholder)');
                                    setShowDeactivateDialog(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Ya, Nonaktifkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
