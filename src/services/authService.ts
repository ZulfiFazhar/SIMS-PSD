import {
    signInWithPopup,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import type { User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BackendUserData {
    id: string;
    firebase_uid: string;
    email: string;
    display_name: string;
    photo_url: string | null;
    phone_number: string | null;
    role: string;
    is_active: boolean;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
}

interface BackendAuthResponse {
    message: string;
    status: string;
    data?: {
        user: BackendUserData;
        is_new_user: boolean;
    };
}

interface AuthSession {
    user: User;
    idToken: string;
    timestamp: number;
}

export const authService = {

    async signInWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const idToken = await firebaseUser.getIdToken();

            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Authentication failed: ${response.statusText}`);
            }

            const data: BackendAuthResponse = await response.json();

            if (!data.data?.user) {
                throw new Error("Backend did not return user data");
            }

            const backendUser = data.data.user;
            const role = backendUser.role.toUpperCase() as User["role"];

            const user: User = {
                id: backendUser.id || firebaseUser.uid,
                email: backendUser.email || firebaseUser.email || "",
                name: backendUser.display_name || firebaseUser.displayName || firebaseUser.email || "User",
                role: role,
                phone: backendUser.phone_number || undefined,
            };

            const userSession: AuthSession = {
                user,
                idToken,
                timestamp: Date.now(),
            };

            localStorage.setItem("auth_session", JSON.stringify(userSession));

            return user;
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    },


    async signOut(): Promise<void> {
        try {
            await firebaseSignOut(auth);
            localStorage.removeItem("auth_session");
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    },


    getCurrentSession(): AuthSession | null {
        const session = localStorage.getItem("auth_session");
        if (!session) return null;

        try {
            return JSON.parse(session);
        } catch {
            return null;
        }
    },


    isSessionValid(): boolean {
        const sessionStr = localStorage.getItem("auth_session");
        if (!sessionStr) return false;

        try {
            const session: AuthSession = JSON.parse(sessionStr);
            const age = Date.now() - session.timestamp;
            // Firebase tokens expire after 1 hour (3600000ms)
            // Check if session is less than 50 minutes old (leave buffer for refresh)
            return age < 3000000; // 50 minutes
        } catch {
            return false;
        }
    },

    async getValidToken(): Promise<string> {
        const session = this.getCurrentSession();

        if (!session) {
            throw new Error("No session found");
        }

        const currentUser = auth.currentUser;
        const tokenAge = Date.now() - session.timestamp;

        // If token is older than 50 minutes, try to refresh
        if (tokenAge > 3000000) {
            // Only refresh if Firebase user is available
            if (!currentUser) {
                // Firebase not yet initialized, but session exists
                // Return existing token (will be refreshed later when Firebase ready)
                console.warn("Firebase user not initialized yet, using existing token");
                return session.idToken;
            }

            try {
                // Force refresh token from Firebase
                const newToken = await currentUser.getIdToken(true);

                // Update session with new token
                const updatedSession: AuthSession = {
                    ...session,
                    idToken: newToken,
                    timestamp: Date.now(),
                };

                localStorage.setItem("auth_session", JSON.stringify(updatedSession));

                return newToken;
            } catch (error) {
                console.error("Token refresh failed:", error);
                // If refresh fails, sign out user
                await this.signOut();
                throw new Error("Token refresh failed. Please sign in again.");
            }
        }

        return session.idToken;
    },

    updateSessionToken(newToken: string): void {
        const session = this.getCurrentSession();
        if (session) {
            const updatedSession: AuthSession = {
                ...session,
                idToken: newToken,
                timestamp: Date.now(),
            };
            localStorage.setItem("auth_session", JSON.stringify(updatedSession));
        }
    },

    async getCurrentUserProfile() {
        try {
            const idToken = await this.getValidToken();

            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to fetch profile: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Get profile error:", error);
            throw error;
        }
    },

    async updateUserProfile(profileData: { display_name?: string; phone_number?: string | null }) {
        try {
            const idToken = await this.getValidToken();

            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to update profile: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Update profile error:", error);
            throw error;
        }
    },
};
