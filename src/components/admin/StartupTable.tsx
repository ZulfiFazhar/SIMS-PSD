import { Badge, Button } from "../SharedUI";
import { Eye } from "lucide-react";
import { type Startup } from "../../types";

interface StartupTableProps {
  startups: Startup[];
  onViewDetail: (startup: Startup) => void;
  onManageTenants: () => void;
}

export function StartupTable({
  startups,
  onViewDetail,
  onManageTenants,
}: StartupTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard Verifikasi
        </h2>
        <Button onClick={onManageTenants} variant="outline">
          Kelola Pengguna
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Startup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ketua
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {startups?.map((startup) => (
              <tr key={startup.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {startup.businessName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {startup.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {startup.teamLeader}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge status={startup.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetail(startup)}
                    className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-auto"
                  >
                    <Eye size={16} /> Detail
                  </button>
                </td>
              </tr>
            ))}
            {startups.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Belum ada data startup masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
