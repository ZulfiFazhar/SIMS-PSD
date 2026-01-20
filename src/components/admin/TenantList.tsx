import { Button, Card } from "../SharedUI";
import { type User } from "../../types";

interface TenantListProps {
    tenants: User[];
    onBack: () => void;
    children?: React.ReactNode;
}

export function TenantList({
    tenants,
    onBack,
    children,
}: TenantListProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
                <Button onClick={onBack} variant="secondary">
                    Kembali ke Dashboard
                </Button>
            </div>

            <Card className="mb-6">
                <h3 className="font-bold mb-4">Tambah Pengguna Baru</h3>
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
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Telepon
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tenants?.map((t) => (
                            <tr key={t.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{t.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {t.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {t.phone || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
