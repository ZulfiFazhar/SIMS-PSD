import {
    signInWithPopup,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import type { User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BackendAuthResponse {
    message: string;
    status: string;
    user?: User;
}

interface AuthSession {
    user: User;
    idToken: string;
    timestamp: number;
}

export const authService = {
    /**
     * Sign in with Google using Firebase popup
     * Then authenticate with backend API
     */
    async signInWithGoogle(): Promise<User> {
        try {
            // Step 1: Firebase Google Sign-In
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // Step 2: Get Firebase ID Token
            const idToken = await firebaseUser.getIdToken();

            // Step 3: Authenticate with Backend
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

            // Step 4: Create user object from backend or Firebase data
            const user: User = data.user || {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || firebaseUser.email || "User",
                role: "TENANT" as const,
            };

            // Step 5: Store session
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

    /**
     * Sign out from Firebase and clear session
     */
    async signOut(): Promise<void> {
        try {
            await firebaseSignOut(auth);
            localStorage.removeItem("auth_session");
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    },

    /**
     * Get current session from localStorage
     */
    getCurrentSession(): AuthSession | null {
        const session = localStorage.getItem("auth_session");
        if (!session) return null;

        try {
            return JSON.parse(session);
        } catch {
            return null;
        }
    },

    /**
     * Check if session is still valid (< 24 hours old)
     */
    isSessionValid(): boolean {
        const sessionStr = localStorage.getItem("auth_session");
        if (!sessionStr) return false;

        try {
            const session: AuthSession = JSON.parse(sessionStr);
            const age = Date.now() - session.timestamp;
            return age < 86400000; // 24 hours (1 day)
        } catch {
            return false;
        }
    },
};
