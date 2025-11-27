import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupDetail } from "../../components/student/StartupDetail";
import { type Startup } from "../../types";

export function StudentStartupDetail() {
  const startup = useLoaderData() as Startup;
  const navigate = useNavigate();

  return (
    <StartupDetail startup={startup} onBack={() => navigate("/student")} />
  );
}
