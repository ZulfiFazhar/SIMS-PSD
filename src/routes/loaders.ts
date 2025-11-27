import { storageService } from "../services/storageService";
import { StartupStatus, UserRole } from "../types";
import { type LoaderFunctionArgs } from "react-router-dom";

// Student Loaders
export function studentDashboardLoader() {
  const user = storageService.getCurrentUser();
  if (!user) return [];
  const allStartups = storageService.getStartups();
  return allStartups.filter((s) => s.studentId === user.id);
}

export function studentRegisterLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const editId = url.searchParams.get("edit");
  if (editId) {
    const startup = storageService.getStartups().find((s) => s.id === editId);
    return startup || null;
  }
  return null;
}

export function studentDetailLoader({ params }: LoaderFunctionArgs) {
  const startup = storageService.getStartups().find((s) => s.id === params.id);
  if (!startup) {
    throw new Response("Startup not found", { status: 404 });
  }
  return startup;
}

// Admin Loaders
export function adminDashboardLoader() {
  const startups = storageService
    .getStartups()
    .filter((s) => s.status !== StartupStatus.DRAFT);
  const lecturers = storageService
    .getUsers()
    .filter((u) => u.role === UserRole.LECTURER);
  return { startups, lecturers };
}

export function adminLecturersLoader() {
  return storageService.getUsers().filter((u) => u.role === UserRole.LECTURER);
}

// Lecturer Loaders
export function lecturerDashboardLoader() {
  const user = storageService.getCurrentUser();
  if (!user) return [];
  const all = storageService.getStartups();
  return all.filter(
    (s) =>
      s.assignedLecturerId === user.id &&
      (s.status === StartupStatus.VERIFIED || s.status === StartupStatus.GRADED)
  );
}

export function lecturerGradingLoader({ params }: LoaderFunctionArgs) {
  const startup = storageService.getStartups().find((s) => s.id === params.id);
  if (!startup) {
    throw new Response("Startup not found", { status: 404 });
  }
  return startup;
}
