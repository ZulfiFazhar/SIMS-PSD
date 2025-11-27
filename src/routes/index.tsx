import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { MainLayout } from "../components/layout/MainLayout";
import { ErrorPage } from "../pages/ErrorPage";

// Loaders
import {
  studentDashboardLoader,
  studentRegisterLoader,
  studentDetailLoader,
  adminDashboardLoader,
  adminLecturersLoader,
  lecturerDashboardLoader,
  lecturerGradingLoader,
} from "./loaders";

// Pages
import { StudentDashboard } from "../pages/student/StudentDashboard";
import { StudentRegister } from "../pages/student/StudentRegister";
import { StudentStartupDetail } from "../pages/student/StudentStartupDetail";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminLecturers } from "../pages/admin/AdminLecturers";
import { LecturerDashboard } from "../pages/lecturer/LecturerDashboard";
import { LecturerGrading } from "../pages/lecturer/LecturerGrading";

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
      // Student Routes
      {
        path: "student",
        children: [
          {
            index: true,
            element: <StudentDashboard />,
            loader: studentDashboardLoader,
          },
          {
            path: "register",
            element: <StudentRegister />,
            loader: studentRegisterLoader,
          },
          {
            path: "startup/:id",
            element: <StudentStartupDetail />,
            loader: studentDetailLoader,
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
          {
            path: "lecturers",
            element: <AdminLecturers />,
            loader: adminLecturersLoader,
          },
        ],
      },
      // Lecturer Routes
      {
        path: "lecturer",
        children: [
          {
            index: true,
            element: <LecturerDashboard />,
            loader: lecturerDashboardLoader,
          },
          {
            path: "grade/:id",
            element: <LecturerGrading />,
            loader: lecturerGradingLoader,
          },
        ],
      },
    ],
  },
]);
