import { storageService } from "../services/storageService";
import { StartupStatus, UserRole } from "../types";
import { type LoaderFunctionArgs } from "react-router-dom";

// Tenant Loaders
export function tenantDashboardLoader() {
  const user = storageService.getCurrentUser();
  if (!user) return [];
  const allStartups = storageService.getStartups();
  return allStartups.filter((s) => s.tenantId === user.id);
}

export function tenantRegisterLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const editId = url.searchParams.get("edit");
  if (editId) {
    const startup = storageService.getStartups().find((s) => s.id === editId);
    return startup || null;
  }
  return null;
}

export function tenantDetailLoader({ params }: LoaderFunctionArgs) {
  const startup = storageService.getStartups().find((s) => s.id === params.id);
  if (!startup) {
    throw new Response("Startup not found", { status: 404 });
  }
  return startup;
}

export function tenantGradingLoader({ params }: LoaderFunctionArgs) {
  const startup = storageService.getStartups().find((s) => s.id === params.id);
  if (!startup) {
    throw new Response("Startup not found", { status: 404 });
  }
  return startup;
}

export function tenantAssignedStartupsLoader() {
  const user = storageService.getCurrentUser();
  if (!user) return [];
  const all = storageService.getStartups();
  return all.filter(
    (s) =>
      s.assignedTenantId === user.id &&
      (s.status === StartupStatus.VERIFIED || s.status === StartupStatus.GRADED)
  );
}

// Admin Loaders
export function adminDashboardLoader() {
  const startups = storageService
    .getStartups()
    .filter((s) => s.status !== StartupStatus.DRAFT);
  const tenants = storageService
    .getUsers()
    .filter((u) => u.role === UserRole.TENANT);
  return { startups, tenants };
}

export function adminTenantsLoader() {
  return storageService.getUsers().filter((u) => u.role === UserRole.TENANT);
}
