import { Button, Badge } from "../SharedUI";
import { Plus, FileText, XCircle, Edit, Eye } from "lucide-react";
import { type Startup, StartupStatus } from "../../types";

interface StartupListProps {
  startups: Startup[];
  onRegisterNew: () => void;
  onEdit: (startup: Startup) => void;
  onViewDetail: (startup: Startup) => void;
}

export function StartupList({
  startups,
  onRegisterNew,
  onEdit,
  onViewDetail,
}: StartupListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard Bisnis Saya
        </h2>
        <Button onClick={onRegisterNew} variant="primary">
          <Plus className="w-4 h-4" /> Daftar Bisnis Baru
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nama Bisnis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tgl Pengajuan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nilai Akhir
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {startups?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500 bg-slate-50/50"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="text-slate-300" />
                      <p>Belum ada bisnis yang didaftarkan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                startups?.map((startup) => (
                  <tr
                    key={startup.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {startup.businessName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {startup.isGrowing ? "Bertumbuh" : "Rintisan (Baru)"}
                      </div>
                      {startup.status === StartupStatus.REJECTED && (
                        <div className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                          <XCircle size={12} /> Perlu Revisi
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {startup.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(
                        startup.submissionDate || ""
                      ).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge status={startup.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {startup.status === StartupStatus.GRADED ? (
                        <span className="font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                          {startup.totalScore?.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center">
                        {startup.status === StartupStatus.DRAFT ? (
                          <Button
                            variant="outline"
                            className="text-xs py-1.5"
                            onClick={() => onEdit(startup)}
                          >
                            <Edit size={14} /> Edit Draft
                          </Button>
                        ) : startup.status === StartupStatus.REJECTED ? (
                          <Button
                            variant="danger"
                            className="text-xs py-1.5"
                            onClick={() => onEdit(startup)}
                          >
                            <Edit size={14} /> Revisi
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            className="text-xs py-1.5"
                            onClick={() => onViewDetail(startup)}
                          >
                            <Eye size={14} /> Detail
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
