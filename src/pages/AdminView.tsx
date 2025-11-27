import { useState } from "react";
import { type User, type Startup, StartupStatus, UserRole } from "../types";
import { storageService } from "../services/storageService";
import { LecturerList } from "../components/admin/LecturerList";
import { AddLecturerForm } from "../components/admin/AddLecturerForm";
import { StartupTable } from "../components/admin/StartupTable";
import { StartupDetailModal } from "../components/admin/StartupDetailModal";

export function AdminView() {
  const [startups, setStartups] = useState<Startup[]>(() =>
    storageService.getStartups().filter((s) => s.status !== StartupStatus.DRAFT)
  );
  const [lecturers, setLecturers] = useState<User[]>(() =>
    storageService.getUsers().filter((u) => u.role === UserRole.LECTURER)
  );
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [viewMode, setViewMode] = useState<"dashboard" | "lecturers">(
    "dashboard"
  );

  const refreshData = () => {
    setStartups(
      storageService
        .getStartups()
        .filter((s) => s.status !== StartupStatus.DRAFT)
    );
    setLecturers(
      storageService.getUsers().filter((u) => u.role === UserRole.LECTURER)
    );
  };

  if (viewMode === "lecturers") {
    return (
      <LecturerList
        lecturers={lecturers}
        onBack={() => setViewMode("dashboard")}
      >
        <AddLecturerForm onSuccess={refreshData} />
      </LecturerList>
    );
  }

  return (
    <>
      <StartupTable
        startups={startups}
        onViewDetail={setSelectedStartup}
        onManageLecturers={() => setViewMode("lecturers")}
      />

      {selectedStartup && (
        <StartupDetailModal
          startup={selectedStartup}
          lecturers={lecturers}
          onClose={() => setSelectedStartup(null)}
          onUpdate={refreshData}
        />
      )}
    </>
  );
}
