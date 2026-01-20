import { useLoaderData, useNavigate } from "react-router-dom";
import { StartupDetail } from "../../components/tenant/StartupDetail";
import { type Startup } from "../../types";

export function TenantStartupDetail() {
    const startup = useLoaderData() as Startup;
    const navigate = useNavigate();

    return (
        <StartupDetail startup={startup} onBack={() => navigate("/tenant")} />
    );
}
