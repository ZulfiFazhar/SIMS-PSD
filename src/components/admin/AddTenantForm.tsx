import { useState } from "react";
import { Input, Button } from "../SharedUI";
import { UserPlus } from "lucide-react";
import { type User, UserRole } from "../../types";
import { storageService } from "../../services/storageService";

interface AddTenantFormProps {
    onSuccess: () => void;
}

export function AddTenantForm({ onSuccess }: AddTenantFormProps) {
    const [newTenant, setNewTenant] = useState<Partial<User>>({});

    const handleAddTenant = () => {
        if (!newTenant.name || !newTenant.email || !newTenant.password) {
            alert("Mohon lengkapi Nama, Email, dan Password.");
            return;
        }
        const user: User = {
            id: `t-${Date.now()}`,
            role: UserRole.TENANT,
            name: newTenant.name,
            email: newTenant.email,
            password: newTenant.password,
            phone: newTenant.phone,
        };
        storageService.saveUser(user);
        setNewTenant({});
        onSuccess();
        alert(
            `Pengguna berhasil ditambahkan. Email: ${user.email}, Password: ${user.password}`
        );
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nama Lengkap"
                    value={newTenant.name || ""}
                    onChange={(e) =>
                        setNewTenant({ ...newTenant, name: e.target.value })
                    }
                />
                <Input
                    label="Email"
                    type="email"
                    value={newTenant.email || ""}
                    onChange={(e) =>
                        setNewTenant({ ...newTenant, email: e.target.value })
                    }
                />
                <Input
                    label="Password Login"
                    type="text"
                    value={newTenant.password || ""}
                    onChange={(e) =>
                        setNewTenant({ ...newTenant, password: e.target.value })
                    }
                    placeholder="Set password pengguna..."
                />
                <Input
                    label="No. HP"
                    value={newTenant.phone || ""}
                    onChange={(e) =>
                        setNewTenant({ ...newTenant, phone: e.target.value })
                    }
                />
            </div>
            <div className="mt-4 flex justify-end">
                <Button onClick={handleAddTenant} variant="primary">
                    <UserPlus size={16} /> Tambah Pengguna
                </Button>
            </div>
        </>
    );
}
