const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface GetTenantsParams {
    status?: 'pending' | 'approved' | 'rejected';
    skip?: number;
    limit?: number;
}

export interface UpdateStatusPayload {
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
}

export const adminService = {
    /**
     * Get all tenants (Admin only)
     * @param token - Firebase ID token
     * @param params - Query parameters (status, skip, limit)
     */
    async getAllTenants(token: string, params?: GetTenantsParams) {
        try {
            const queryParams = new URLSearchParams();
            if (params?.status) queryParams.append('status', params.status);
            if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
            if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

            const url = `${API_BASE_URL}/api/tenant/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to fetch tenants: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data; // Returns { tenants: [], total: number, skip: number, limit: number }
        } catch (error) {
            console.error('Get tenants error:', error);
            throw error;
        }
    },

    /**
     * Update tenant status (Admin only)
     * @param token - Firebase ID token
     * @param tenantId - Tenant ID
     * @param payload - Status update payload
     */
    async updateTenantStatus(token: string, tenantId: string, payload: UpdateStatusPayload) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tenant/${tenantId}/status`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Extract error message from various error formats
                let errorMessage = 'Failed to update status';
                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                } else if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = `Failed to update status: ${response.statusText}`;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.data; // Returns { tenant_id, status, rejection_reason }
        } catch (error) {
            console.error('Update tenant status error:', error);
            throw error;
        }
    },
};
