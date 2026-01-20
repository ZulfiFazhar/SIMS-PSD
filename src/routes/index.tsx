import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { MainLayout } from "../components/layout/MainLayout";
import { ErrorPage } from "../pages/ErrorPage";

// Loaders
import {
  tenantDashboardLoader,
  tenantRegisterLoader,
  tenantDetailLoader,
  tenantProfileLoader,
  adminDashboardLoader,
} from "./loaders";

// Pages
import { TenantDashboard } from "../pages/tenant/TenantDashboard";
import { TenantRegister } from "../pages/tenant/TenantRegister";
import { TenantStartupDetail } from "../pages/tenant/TenantStartupDetail";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { TenantProfile } from "../pages/tenant/TenantProfile";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      // Tenant Routes
      {
        path: "tenant",
        children: [
          {
            index: true,
            element: <TenantDashboard />,
            loader: tenantDashboardLoader,
          },
          {
            path: "register",
            element: <TenantRegister />,
            loader: tenantRegisterLoader,
          },
          {
            path: "startup/:id",
            element: <TenantStartupDetail />,
            loader: tenantDetailLoader,
          },
          {
            path: "profile",
            element: <TenantProfile />,
            loader: tenantProfileLoader,
          },
        ],
      },
      // Admin Routes
      {
        path: "admin",
        children: [
          {
            index: true,
            element: <AdminDashboard />,
            loader: adminDashboardLoader,
          },
        ],
      },
    ],
  },
]);
