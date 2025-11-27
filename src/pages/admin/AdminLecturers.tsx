import { useLoaderData, useNavigate } from "react-router-dom";
import { LecturerList } from "../../components/admin/LecturerList";
import { AddLecturerForm } from "../../components/admin/AddLecturerForm";
import { type User } from "../../types";

export function AdminLecturers() {
  const lecturers = useLoaderData() as User[];
  const navigate = useNavigate();

  return (
    <LecturerList lecturers={lecturers} onBack={() => navigate("/admin")}>
      <AddLecturerForm
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </LecturerList>
  );
}
