import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupList } from "../../components/student/StartupList";
import { type Startup } from "../../types";
import { useAuth } from "../../context/AuthContext";

export function StudentDashboard() {
  const startups = useLoaderData() as Startup[];
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <StartupList
      startups={startups}
      onRegisterNew={() => navigate("/student/register")}
      onEdit={(startup) => navigate(`/student/register?edit=${startup.id}`)}
      onViewDetail={(startup) => navigate(`/student/startup/${startup.id}`)}
    />
  );
}
