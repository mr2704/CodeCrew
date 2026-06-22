import axios from "axios";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface UserResponseData {
  id: string;
  name: string;
  email: string;
  college: string;
  year: string;
  skills: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  avatar?: string;
}

export interface GetUsersResponse {
  success: boolean;
  count: number;
  users: UserResponseData[];
}

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

/**
 * Fetch all student developers from the backend.
 * GET /api/users
 */
export const getAllUsers = async (): Promise<UserResponseData[]> => {
    try {
        const response = await api.get<GetUsersResponse>("/users");
        return response.data.users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
};

export default api;