import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupWizard } from "../../components/student/wizard/StartupWizard";
import { type Startup, StartupStatus } from "../../types";
import { useAuth } from "../../context/AuthContext";

export function StudentRegister() {
  const initialData = useLoaderData() as Startup | null;
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const defaultData: Partial<Startup> = {
    studentId: user.id,
    teamMembers: [],
    status: StartupStatus.DRAFT,
    documents: {},
    isGrowing: false,
  };

  return (
    <StartupWizard
      initialData={initialData || defaultData}
      onCancel={() => navigate("/student")}
      onSuccess={() => navigate("/student")}
    />
  );
}
