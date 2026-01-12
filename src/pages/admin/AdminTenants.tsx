import { useLoaderData, useNavigate } from "react-router-dom";
import { TenantList } from "../../components/admin/TenantList";
import { AddTenantForm } from "../../components/admin/AddTenantForm";
import { type User } from "../../types";

export function AdminTenants() {
    const tenants = useLoaderData() as User[];
    const navigate = useNavigate();

    return (
        <TenantList tenants={tenants} onBack={() => navigate("/admin")}>
            <AddTenantForm
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </TenantList>
    );
}
