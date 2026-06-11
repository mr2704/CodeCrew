import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getAllUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data.users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
};

export default api;