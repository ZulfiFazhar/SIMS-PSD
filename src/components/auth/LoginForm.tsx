import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      await login();
      // Navigation handled by AuthPage after user state update
    } catch (err) {
      console.error("Login failed:", err);
      // Error already set in AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isSigningIn || loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        {isSigningIn ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <FcGoogle className="w-5 h-5" />
            Masuk dengan Google
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error.includes("popup") || error.includes("cancelled")
            ? "Login dibatalkan. Silakan coba lagi."
            : error.includes("blocked")
              ? "Popup diblokir browser. Harap izinkan popup dan coba lagi."
              : "Login gagal. Silakan coba lagi."}
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
