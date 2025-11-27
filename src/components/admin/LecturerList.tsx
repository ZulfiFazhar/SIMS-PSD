import { Button, Card } from "../SharedUI";
import { type User } from "../../types";

interface LecturerListProps {
  lecturers: User[];
  onBack: () => void;
  children?: React.ReactNode; // For the AddLecturerForm
}

export function LecturerList({
  lecturers,
  onBack,
  children,
}: LecturerListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Dosen</h2>
        <Button onClick={onBack} variant="secondary">
          Kembali ke Dashboard
        </Button>
      </div>

      <Card className="mb-6">
        <h3 className="font-bold mb-4">Tambah Dosen Baru</h3>
        {children}
      </Card>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lecturers?.map((l) => (
              <tr key={l.id}>
                <td className="px-6 py-4 whitespace-nowrap">{l.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {l.nip || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {l.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
