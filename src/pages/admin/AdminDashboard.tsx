import { useState, useEffect, useCallback } from "react";
import { Users, Clock, CheckCircle, XCircle, Eye, ChevronDown, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import type { TenantRegistration, TenantRegistrationStatus } from "../../types";
import { TenantRegistrationStatus as StatusEnum } from "../../types";
import { StatusUpdateDialog } from "../../components/admin/StatusUpdateDialog";
import { FilePreviewModal } from "../../components/admin/FilePreviewModal";
import { TenantDetailModal } from "../../components/admin/TenantDetailModal";
import { adminService } from "../../services/adminService";
import { authService } from "../../services/authService";

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
  const [tenants, setTenants] = useState<TenantRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<TenantRegistration | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showTenantDetail, setShowTenantDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [systemStatuses, setSystemStatuses] = useState<{ [key: string]: string }>({});
  const itemsPerPage = 10;

  const fetchTenants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await authService.getValidToken();
      const params = statusFilter !== "all" ? { status: statusFilter as TenantRegistrationStatus } : undefined;
      const data = await adminService.getAllTenants(token, params);
      setTenants(data.tenants);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data tenant');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  // Generate and store system statuses
  useEffect(() => {
    const storedStatuses = localStorage.getItem('tenant_system_statuses');
    if (storedStatuses) {
      setSystemStatuses(JSON.parse(storedStatuses));
    }
  }, []);

  useEffect(() => {
    if (tenants.length > 0) {
      const newStatuses = { ...systemStatuses };
      let hasNewStatuses = false;

      tenants.forEach((tenant) => {
        if (!newStatuses[tenant.id]) {
          // Generate random status: PASS or REJECTED
          newStatuses[tenant.id] = Math.random() > 0.5 ? 'PASS' : 'REJECTED';
          hasNewStatuses = true;
        }
      });

      if (hasNewStatuses) {
        setSystemStatuses(newStatuses);
        localStorage.setItem('tenant_system_statuses', JSON.stringify(newStatuses));
      }
    }
  }, [tenants, systemStatuses]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleStatusUpdate = async (rejectionReason?: string) => {
    if (!selectedTenant) return;

    try {
      const token = await authService.getValidToken();
      await adminService.updateTenantStatus(token, selectedTenant.id, {
        status: selectedTenant.status,
        rejection_reason: rejectionReason,
      });

      await fetchTenants();
      setShowStatusDialog(false);
      setSelectedTenant(null);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

  const totalTenants = tenants.length;
  const pendingCount = tenants.filter(t => t.status === StatusEnum.PENDING).length;
  const approvedCount = tenants.filter(t => t.status === StatusEnum.APPROVED).length;
  const rejectedCount = tenants.filter(t => t.status === StatusEnum.REJECTED).length;

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.nama_bisnis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.nama_ketua_tim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.nim_nidn_ketua.includes(searchQuery);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTenants = filteredTenants.slice(startIndex, endIndex);

  const handleStatusChange = (tenant: TenantRegistration, newStatus: TenantRegistrationStatus) => {
    setSelectedTenant({ ...tenant, status: newStatus });
    setShowStatusDialog(true);
  };

  const handleViewFiles = (tenant: TenantRegistration) => {
    setSelectedTenant(tenant);
    setShowFilePreview(true);
  };

  const handleViewTenantDetail = (tenant: TenantRegistration) => {
    setSelectedTenant(tenant);
    setShowTenantDetail(true);
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

  if (isLoading) {
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data tenant...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Gagal Memuat Data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchTenants}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama bisnis, ketua tim, atau NIM..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Tenant</h2>
          <p className="text-sm text-gray-600 mt-1">
            Kelola semua akun tenant dan status pendaftaran
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Sistem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubah Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail Tenant</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTenants.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center">
                    <p className="text-gray-500">Tidak ada tenant ditemukan</p>
                  </td>
                </tr>
              ) : (
                paginatedTenants.map((tenant, index) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tenant.nama_bisnis}</div>
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
                      {systemStatuses[tenant.id] ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${systemStatuses[tenant.id] === 'PASS'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                          {systemStatuses[tenant.id]}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
                        onClick={() => handleViewFiles(tenant)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        File
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewTenantDetail(tenant)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages} ({filteredTenants.length} tenant)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Dialog */}
      {showStatusDialog && selectedTenant && (
        <StatusUpdateDialog
          tenant={selectedTenant}
          newStatus={selectedTenant.status}
          onClose={() => setShowStatusDialog(false)}
          onConfirm={handleStatusUpdate}
        />
      )}

      {/* File Preview Modal */}
      {showFilePreview && selectedTenant && (
        <FilePreviewModal
          tenant={selectedTenant}
          onClose={() => setShowFilePreview(false)}
        />
      )}

      {/* Tenant Detail Modal */}
      {showTenantDetail && selectedTenant && (
        <TenantDetailModal
          tenant={selectedTenant}
          onClose={() => setShowTenantDetail(false)}
        />
      )}
    </div>
  );
}
