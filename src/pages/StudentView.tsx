import { useState, useMemo } from "react";
import { type User, type Startup, StartupStatus } from "../types";
import { storageService } from "../services/storageService";
import { StartupList } from "../components/student/StartupList";
import { StartupDetail } from "../components/student/StartupDetail";
import { StartupWizard } from "../components/student/wizard/StartupWizard";

interface Props {
  user: User;
}

export function StudentView({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"list" | "register">("list");
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [formData, setFormData] = useState<Partial<Startup>>({
    studentId: user.id,
    teamMembers: [],
    status: StartupStatus.DRAFT,
    documents: {},
    isGrowing: false,
  });

  const startups = useMemo(() => {
    const all = storageService.getStartups();
    return all.filter((s) => s.studentId === user.id);
  }, [user.id]);

  const resetForm = () => {
    setFormData({
      studentId: user.id,
      teamMembers: [],
      status: StartupStatus.DRAFT,
      documents: {},
      isGrowing: false,
    });
  };

  if (selectedStartup) {
    return (
      <StartupDetail
        startup={selectedStartup}
        onBack={() => setSelectedStartup(null)}
      />
    );
  }

  if (activeTab === "register") {
    return (
      <StartupWizard
        initialData={formData}
        onCancel={() => {
          setActiveTab("list");
          resetForm();
        }}
        onSuccess={() => {
          setActiveTab("list");
          resetForm();
        }}
      />
    );
  }

  return (
    <StartupList
      startups={startups}
      onRegisterNew={() => {
        resetForm();
        setActiveTab("register");
      }}
      onEdit={(startup) => {
        setFormData(startup);
        setActiveTab("register");
      }}
      onViewDetail={setSelectedStartup}
    />
  );
}
