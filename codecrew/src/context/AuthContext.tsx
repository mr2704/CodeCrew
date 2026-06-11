import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/authService';
import type { User, TeammateRequest } from '../types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  college: string;
  year: string;
  skills: string[];
}

// Shape of a raw user object returned by the backend (uses _id, not id)
interface BackendUser {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  college?: string;
  year?: string;
  skills?: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  role?: 'student' | 'admin';
}

interface AuthContextType {
  currentUser: User | null;
  requests: TeammateRequest[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  sendInvite: (developerId: string, projectName: string, message: string) => void;
  respondToInvite: (requestId: string, status: 'accepted' | 'declined') => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalises a raw backend user object to the frontend User interface. */
function normalizeUser(raw: BackendUser): User {
  return {
    id: raw._id,
    email: raw.email,
    name: raw.name,
    avatar: raw.avatar,
    college: raw.college,
    year: raw.year,
    skills: raw.skills,
    bio: raw.bio,
    github: raw.github,
    linkedin: raw.linkedin,
    role: raw.role,
  };
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const initialMockRequests: TeammateRequest[] = [
  {
    id: 'req_1',
    senderId: 'dev_2',
    senderName: 'Emily Chen',
    senderAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    receiverId: 'user_current',
    projectName: 'NeuroMatch AI',
    message:
      'Hey, I saw your skills in React and node.js! We are building an AI-powered study partner and would love to have you help with the frontend.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3_600_000 * 5).toISOString(),
  },
  {
    id: 'req_2',
    senderId: 'dev_6',
    senderName: 'Chloe Dubois',
    senderAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    receiverId: 'user_current',
    projectName: 'Immersive Canvas',
    message:
      'Working on a 3D web gallery for digital art. Need someone to help with setting up the state store and UI layouts.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3_600_000 * 24).toISOString(),
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<TeammateRequest[]>([]);

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('codecrew_token');

      if (token) {
        try {
          const response = await getProfile(token);
          setCurrentUser(normalizeUser(response.user as BackendUser));
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('codecrew_token');
        }
      }

      const savedRequests = localStorage.getItem('codecrew_requests');
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests) as TeammateRequest[]);
      } else {
        setRequests(initialMockRequests);
        localStorage.setItem('codecrew_requests', JSON.stringify(initialMockRequests));
      }
    };

    initializeAuth();
  }, []);

  // ─── Auth actions ────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser({ email, password });
      setCurrentUser(normalizeUser(data.user as BackendUser));
      localStorage.setItem('codecrew_token', data.token as string);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const data = await registerUser(userData);
      setCurrentUser(normalizeUser(data.user as BackendUser));
      localStorage.setItem('codecrew_token', data.token as string);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('codecrew_token');
  };

  // ─── Invite actions ──────────────────────────────────────────────────────────

  const sendInvite = (developerId: string, projectName: string, message: string): void => {
    const newRequest: TeammateRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser?.id ?? 'user_current',
      senderName: currentUser?.name ?? 'Anonymous User',
      senderAvatar:
        currentUser?.avatar ??
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
      receiverId: developerId,
      projectName: projectName || 'General Collaboration',
      message: message || 'Hey! I would love to collaborate on a project with you.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem('codecrew_requests', JSON.stringify(updated));
  };

  const respondToInvite = (requestId: string, status: 'accepted' | 'declined'): void => {
    const updated = requests.map((req) =>
      req.id === requestId ? { ...req, status } : req
    );
    setRequests(updated);
    localStorage.setItem('codecrew_requests', JSON.stringify(updated));
  };

  // ─── Profile ─────────────────────────────────────────────────────────────────

  const updateProfile = (updatedData: Partial<User>): void => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updatedData });
  };

  // ─── Provider ────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{ currentUser, requests, login, register, logout, sendInvite, respondToInvite, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};