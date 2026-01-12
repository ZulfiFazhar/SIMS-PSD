import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupList } from "../../components/tenant/StartupList";
import { type Startup } from "../../types";
import { useAuth } from "../../context/AuthContext";

export function TenantDashboard() {
    const startups = useLoaderData() as Startup[];
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) return null;

    return (
        <StartupList
            startups={startups}
            onRegisterNew={() => navigate("/tenant/register")}
            onEdit={(startup) => navigate(`/tenant/register?edit=${startup.id}`)}
            onViewDetail={(startup) => navigate(`/tenant/startup/${startup.id}`)}
        />
    );
}
