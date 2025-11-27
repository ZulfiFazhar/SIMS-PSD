import { useState } from "react";
import { Input, Button } from "../SharedUI";
import { Info } from "lucide-react";
import { type User, UserRole } from "../../types";
import { storageService } from "../../services/storageService";

interface RegisterFormProps {
  onRegisterSuccess: (user: User) => void;
  onCancel: () => void;
}

export function RegisterForm({
  onRegisterSuccess,
  onCancel,
}: RegisterFormProps) {
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [stepOtp, setStepOtp] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepOtp) {
      setStepOtp(true);
      alert("Kode OTP Anda: 1234");
      return;
    }

    if (regOtp === "1234") {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: regName,
        email: `${regName.toLowerCase().replace(" ", "")}@student.univ.ac.id`,
        role: UserRole.STUDENT,
        phone: regPhone,
        password: "123", // Auto-set password for student registration simulation
      };
      storageService.saveUser(newUser);

      // Auto login setelah registrasi
      storageService.login(newUser.id);
      alert(`Registrasi berhasil! Password Anda: ${newUser.password}`);
      onRegisterSuccess(newUser);
    } else {
      alert("OTP Salah!");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <h3 className="text-lg font-medium text-center">Registrasi Mahasiswa</h3>
      {!stepOtp ? (
        <>
          <Input
            label="Nama Lengkap"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
            required
          />
          <Input
            label="No. WhatsApp"
            type="tel"
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Kirim OTP
          </Button>
        </>
      ) : (
        <>
          <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 mb-4 flex gap-2">
            <Info size={16} className="mt-0.5" />
            <div>
              Kode OTP dikirim ke <strong>{regPhone}</strong>. Gunakan{" "}
              <strong>1234</strong>.
            </div>
          </div>
          <Input
            label="Masukkan OTP"
            value={regOtp}
            onChange={(e) => setRegOtp(e.target.value)}
            required
            className="text-center tracking-[0.5em] font-bold text-xl"
          />
          <Button type="submit" variant="success" className="w-full">
            Verifikasi & Masuk
          </Button>
        </>
      )}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Kembali ke Login
        </button>
      </div>
    </form>
  );
}
