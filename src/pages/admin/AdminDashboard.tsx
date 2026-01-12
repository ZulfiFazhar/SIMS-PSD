import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupTable } from "../../components/admin/StartupTable";
import { StartupDetailModal } from "../../components/admin/StartupDetailModal";
import { type Startup, type User } from "../../types";
import { useState } from "react";

export function AdminDashboard() {
  const { startups, tenants } = useLoaderData() as {
    startups: Startup[];
    tenants: User[];
  };
  const navigate = useNavigate();
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  return (
    <>
      <StartupTable
        startups={startups}
        onViewDetail={setSelectedStartup}
        onManageTenants={() => navigate("/admin/tenants")}
      />

      {selectedStartup && (
        <StartupDetailModal
          startup={selectedStartup}
          tenants={tenants}
          onClose={() => setSelectedStartup(null)}
          onUpdate={() => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
