const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const tenantService = {
    async registerStartup(formData: FormData, token: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tenant/register`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type is set automatically for FormData
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Registration failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Tenant registration error:", error);
            throw error;
        }
    },
};
