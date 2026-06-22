import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ─── TypeScript Interfaces ──────────────────────────────────────────────────

export interface UserPayload {
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

export interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
    user?: UserPayload;
}

export interface ProfileResponse {
    success: boolean;
    token?: string; // Token might be re-issued if email is updated
    message?: string;
    user?: UserPayload;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    college: string;
    year: string;
    skills: string[];
    bio?: string;
    github?: string;
    linkedin?: string;
}

export interface ProfileUpdateData {
    name?: string;
    email?: string;
    college?: string;
    year?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    skills?: string[];
}

// ─── API Services ───────────────────────────────────────────────────────────

/**
 * Authenticate a user and obtain a JWT token.
 * POST /api/auth/login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
        `${API_URL}/login`,
        credentials
    );
    return response.data;
};

/**
 * Register a new user profile.
 * POST /api/auth/register
 */
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
        `${API_URL}/register`,
        userData
    );
    return response.data;
};

/**
 * Update the profile details of the authenticated user.
 * PUT /api/auth/profile
 */
export const updateUserProfile = async (
    token: string,
    userData: ProfileUpdateData
): Promise<ProfileResponse> => {
    const response = await axios.put<ProfileResponse>(
        `${API_URL}/profile`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

/**
 * Fetch the profile of the authenticated user.
 * GET /api/auth/profile
 */
export const getProfile = async (token: string): Promise<ProfileResponse> => {
    const response = await axios.get<ProfileResponse>(
        `${API_URL}/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Aliases for improved compatibility
export const updateProfile = updateUserProfile;
export const getUserProfile = getProfile;