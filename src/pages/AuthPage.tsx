import { LoginForm } from "../components/auth/LoginForm";
import { InkubatorLogo } from "../components/auth/InkubatorLogo";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { UserRole } from "../types";
import { storageService } from "../services/storageService";

export function AuthPage() {
  const { login, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    switch (user.role) {
      case UserRole.TENANT:
        return <Navigate to="/tenant" replace />;
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  const handleLogin = (userId: string) => {
    login(userId);
    // Navigation is handled by the redirect above after state update
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <InkubatorLogo />

          <div className="mt-8">
            <LoginForm
              onLogin={handleLogin}
              availableUsers={storageService.getUsers()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
