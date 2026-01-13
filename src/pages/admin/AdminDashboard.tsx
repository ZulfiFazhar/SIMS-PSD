import { useState } from "react";
import { Users, Clock, CheckCircle, XCircle, Eye, ChevronDown } from "lucide-react";
import type { TenantRegistration, TenantRegistrationStatus } from "../../types";
import { TenantRegistrationStatus as StatusEnum } from "../../types";
import { StatusUpdateDialog } from "../../components/admin/StatusUpdateDialog";
import { FilePreviewModal } from "../../components/admin/FilePreviewModal";

// Mock data for demonstration
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

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
  iconColor: string;
}

function StatCard({ icon, title, value, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [tenants] = useState<TenantRegistration[]>(mockTenants);
  const [selectedTenant, setSelectedTenant] = useState<TenantRegistration | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);

  // Calculate stats
  const totalTenants = tenants.length;
  const pendingCount = tenants.filter(t => t.status === StatusEnum.PENDING).length;
  const approvedCount = tenants.filter(t => t.status === StatusEnum.APPROVED).length;
  const rejectedCount = tenants.filter(t => t.status === StatusEnum.REJECTED).length;

  // Get top 5 pending tenants (oldest first - most urgent)
  const pendingTenants = tenants
    .filter(t => t.status === StatusEnum.PENDING)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 5);

  const handleStatusChange = (tenant: TenantRegistration, newStatus: TenantRegistrationStatus) => {
    setSelectedTenant({ ...tenant, status: newStatus });
    setShowStatusDialog(true);
  };

  const handleViewFiles = (tenant: TenantRegistration) => {
    setSelectedTenant(tenant);
    setShowFilePreview(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };


  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola pendaftaran tenant inkubator bisnis</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Total Tenant"
          value={totalTenants}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="Pending Review"
          value={pendingCount}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Disetujui"
          value={approvedCount}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<XCircle className="w-6 h-6" />}
          title="Ditolak"
          value={rejectedCount}
          bgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Top 5 Pending Tenants Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top 5 Tenant Butuh Review Segera</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tenant paling lama menunggu validasi (diurutkan berdasarkan urgensitas)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bisnis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua Tim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fakultas / Prodi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-gray-500">Tidak ada tenant yang menunggu review</p>
                  </td>
                </tr>
              ) : (
                pendingTenants.map((tenant, index) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tenant.nama_bisnis}</div>
                      <div className="text-xs text-gray-500">{tenant.jenis_usaha}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tenant.nama_ketua_tim}</div>
                      <div className="text-xs text-gray-500">{tenant.nim_nidn_ketua}</div>
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
            // Placeholder for API call
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
    </div>
  );
}
