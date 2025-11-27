import { useLoaderData, useNavigate } from "react-router-dom";
import { GradingForm } from "../../components/lecturer/GradingForm";
import { type Startup } from "../../types";

export function LecturerGrading() {
  const startup = useLoaderData() as Startup;
  const navigate = useNavigate();

  return (
    <GradingForm
      startup={startup}
      onBack={() => navigate("/lecturer")}
      onSuccess={() => navigate("/lecturer")}
    />
  );
}
