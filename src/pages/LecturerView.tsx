import { useState, useMemo } from "react";
import { type User, type Startup, StartupStatus } from "../types";
import { storageService } from "../services/storageService";
import { AssignedStartups } from "../components/lecturer/AssignedStartups";
import { GradingForm } from "../components/lecturer/GradingForm";

interface Props {
  user: User;
}

export function LecturerView({ user }: Props) {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  const assignedStartups = useMemo(() => {
    const all = storageService.getStartups();
    return all.filter(
      (s) =>
        s.assignedLecturerId === user.id &&
        (s.status === StartupStatus.VERIFIED ||
          s.status === StartupStatus.GRADED)
    );
  }, [user.id]);

  if (selectedStartup) {
    return (
      <GradingForm
        startup={selectedStartup}
        onBack={() => setSelectedStartup(null)}
        onSuccess={() => setSelectedStartup(null)}
      />
    );
  }

  return (
    <AssignedStartups
      startups={assignedStartups}
      onSelect={setSelectedStartup}
    />
  );
}
