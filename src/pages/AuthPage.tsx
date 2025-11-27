import { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { UserRole } from "../types";
import { storageService } from "../services/storageService";

export function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    switch (user.role) {
      case UserRole.STUDENT:
        return <Navigate to="/student" replace />;
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.LECTURER:
        return <Navigate to="/lecturer" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleLogin = (userId: string) => {
    login(userId);
    navigate("/student");
    // Navigation is handled by the redirect above after state update
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Inkubator Bisnis
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isRegistering ? "Daftar akun baru" : "Masuk ke akun Anda"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          {isRegistering ? (
            <RegisterForm
              onRegisterSuccess={(newUser) => {
                setIsRegistering(false);
                handleLogin(newUser.id);
              }}
              onCancel={() => setIsRegistering(false)}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              availableUsers={storageService.getUsers()}
              onRegisterClick={() => setIsRegistering(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
