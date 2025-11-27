import { useLoaderData, useNavigate } from "react-router-dom";
import { AssignedStartups } from "../../components/lecturer/AssignedStartups";
import { type Startup } from "../../types";

export function LecturerDashboard() {
  const startups = useLoaderData() as Startup[];
  const navigate = useNavigate();

  return (
    <AssignedStartups
      startups={startups}
      onSelect={(startup) => navigate(`/lecturer/grade/${startup.id}`)}
    />
  );
}
