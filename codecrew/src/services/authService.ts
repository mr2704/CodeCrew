import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (credentials: {
    email: string;
    password: string;
}) => {
    const response = await axios.post(
        `${API_URL}/login`,
        credentials
    );

    return response.data;
};

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    college: string;
    year: string;
    skills: string[];
}) => {
    const response = await axios.post(
        `${API_URL}/register`,
        userData
    );

    return response.data;
};

export const getProfile = async (token: string) => {
    const response = await axios.get(
        `${API_URL}/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};