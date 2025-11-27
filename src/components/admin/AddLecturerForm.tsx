import { useState } from "react";
import { Input, Button } from "../SharedUI";
import { UserPlus } from "lucide-react";
import { type User, UserRole } from "../../types";
import { storageService } from "../../services/storageService";

interface AddLecturerFormProps {
  onSuccess: () => void;
}

export function AddLecturerForm({ onSuccess }: AddLecturerFormProps) {
  const [newLecturer, setNewLecturer] = useState<Partial<User>>({});

  const handleAddLecturer = () => {
    if (!newLecturer.name || !newLecturer.email || !newLecturer.password) {
      alert("Mohon lengkapi Nama, Email, dan Password.");
      return;
    }
    const user: User = {
      id: `d-${Date.now()}`,
      role: UserRole.LECTURER,
      name: newLecturer.name,
      email: newLecturer.email,
      password: newLecturer.password,
      nip: newLecturer.nip,
      phone: newLecturer.phone,
    };
    storageService.saveUser(user);
    setNewLecturer({});
    onSuccess();
    alert(
      `Dosen berhasil ditambahkan. Email: ${user.email}, Password: ${user.password}`
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap"
          value={newLecturer.name || ""}
          onChange={(e) =>
            setNewLecturer({ ...newLecturer, name: e.target.value })
          }
        />
        <Input
          label="Email"
          type="email"
          value={newLecturer.email || ""}
          onChange={(e) =>
            setNewLecturer({ ...newLecturer, email: e.target.value })
          }
        />
        <Input
          label="Password Login"
          type="text"
          value={newLecturer.password || ""}
          onChange={(e) =>
            setNewLecturer({ ...newLecturer, password: e.target.value })
          }
          placeholder="Set password dosen..."
        />
        <Input
          label="NIP"
          value={newLecturer.nip || ""}
          onChange={(e) =>
            setNewLecturer({ ...newLecturer, nip: e.target.value })
          }
        />
        <Input
          label="No. HP"
          value={newLecturer.phone || ""}
          onChange={(e) =>
            setNewLecturer({ ...newLecturer, phone: e.target.value })
          }
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleAddLecturer} variant="primary">
          <UserPlus size={16} /> Tambah Dosen
        </Button>
      </div>
    </>
  );
}
