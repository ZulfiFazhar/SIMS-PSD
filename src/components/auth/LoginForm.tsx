import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ShieldCheck } from "lucide-react";
import { type User } from "../../types";

interface LoginFormProps {
  onLogin: (userId: string) => void;
  availableUsers: User[];
}

export function LoginForm({ onLogin, availableUsers }: LoginFormProps) {
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  const handleGoogleLoginClick = () => {
    setShowAccountSelector(!showAccountSelector);
  };

  const handleAccountSelect = (user: User) => {
    onLogin(user.id);
  };

  return (
    <div className="space-y-6">
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLoginClick}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 shadow-sm hover:shadow"
        type="button"
      >
        <FcGoogle className="w-5 h-5" />
        Masuk dengan Google
      </button>

      {/* Demo Account Selector */}
      {showAccountSelector && (
        <div className="space-y-2 animate-fadeIn">
          <p className="text-xs text-gray-500 text-center font-medium">
            Pilih Akun Demo:
          </p>
          {availableUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleAccountSelect(user)}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
              type="button"
            >
              <div className="text-left">
                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <div className="text-xs px-2 py-1 bg-gray-100 group-hover:bg-blue-100 rounded text-gray-600 group-hover:text-blue-600 font-medium">
                {user.role}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4" />
        <span>Login aman dengan akun Google Anda</span>
      </div>
    </div>
  );
}
