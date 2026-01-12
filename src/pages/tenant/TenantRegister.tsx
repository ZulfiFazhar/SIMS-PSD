import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupWizard } from "../../components/tenant/wizard/StartupWizard";
import { type Startup, StartupStatus } from "../../types";
import { useAuth } from "../../context/AuthContext";

export function TenantRegister() {
    const initialData = useLoaderData() as Startup | null;
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) return null;

    const defaultData: Partial<Startup> = {
        tenantId: user.id,
        teamMembers: [],
        status: StartupStatus.DRAFT,
        documents: {},
        isGrowing: false,
    };

    return (
        <StartupWizard
            initialData={initialData || defaultData}
            onCancel={() => navigate("/tenant")}
            onSuccess={() => navigate("/tenant")}
        />
    );
}
