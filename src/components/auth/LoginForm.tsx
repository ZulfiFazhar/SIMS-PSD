import { useState } from "react";
import { Input, Button } from "../SharedUI";
import { type User } from "../../types";

interface LoginFormProps {
  onLogin: (userId: string) => void;
  availableUsers: User[];
  onRegisterClick: () => void;
}

export function LoginForm({
  onLogin,
  availableUsers,
  onRegisterClick,
}: LoginFormProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword) {
      alert("Mohon masukkan password.");
      return;
    }

    const foundUser = availableUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    // Login Verification
    if (foundUser && foundUser.password === loginPassword) {
      onLogin(foundUser.id);
    } else {
      alert("Email atau Password salah! (Cek kredensial demo di bawah)");
    }
  };

  return (
    <div>
      <form onSubmit={handleManualLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="nama@email.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="********"
          required
        />
        <Button type="submit" className="w-full">
          Masuk
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <p className="text-center text-sm text-slate-500 mb-4">
          Belum punya akun?
        </p>
        <button
          onClick={onRegisterClick}
          className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
        >
          Registrasi Pengguna Baru
        </button>
      </div>

      {/* Informasi Akun Demo */}
      <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Informasi Akun Demo (Simulasi)
        </h4>
        <div className="space-y-2 text-xs">
          {availableUsers.slice(0, 3).map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center border-b border-slate-200 pb-1 last:border-0"
            >
              <div>
                <span className="font-medium text-slate-700">{u.role}</span>
                <div className="text-slate-500">{u.name}</div>
              </div>
              <div className="text-right font-mono bg-white px-2 py-1 rounded border">
                {u.email}
                <div className="text-[10px] text-slate-400">
                  Pass: {u.password || "123456"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
