import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupTable } from "../../components/admin/StartupTable";
import { StartupDetailModal } from "../../components/admin/StartupDetailModal";
import { type Startup, type User } from "../../types";
import { useState } from "react";

export function AdminDashboard() {
  const { startups, lecturers } = useLoaderData() as {
    startups: Startup[];
    lecturers: User[];
  };
  const navigate = useNavigate();
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  return (
    <>
      <StartupTable
        startups={startups}
        onViewDetail={setSelectedStartup}
        onManageLecturers={() => navigate("/admin/lecturers")}
      />

      {selectedStartup && (
        <StartupDetailModal
          startup={selectedStartup}
          lecturers={lecturers}
          onClose={() => setSelectedStartup(null)}
          onUpdate={() => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
