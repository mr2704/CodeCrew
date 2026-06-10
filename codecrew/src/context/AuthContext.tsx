import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, TeammateRequest } from '../types';

interface AuthContextType {
  currentUser: User | null;
  requests: TeammateRequest[];
  login: (email: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  sendInvite: (developerId: string, projectName: string, message: string) => void;
  respondToInvite: (requestId: string, status: 'accepted' | 'declined') => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock requests for simulation
const initialMockRequests: TeammateRequest[] = [
  {
    id: 'req_1',
    senderId: 'dev_2',
    senderName: 'Emily Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    receiverId: 'user_current',
    projectName: 'NeuroMatch AI',
    message: 'Hey, I saw your skills in React and node.js! We are building an AI-powered study partner and would love to have you help with the frontend.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'req_2',
    senderId: 'dev_6',
    senderName: 'Chloe Dubois',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    receiverId: 'user_current',
    projectName: 'Immersive Canvas',
    message: 'Working on a 3D web gallery for digital art. Need someone to help with setting up the state store and UI layouts.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<TeammateRequest[]>([]);

  // Load simulated user on mount if desired, or start unauthenticated
  useEffect(() => {
    const savedUser = localStorage.getItem('codecrew_user');
    const savedRequests = localStorage.getItem('codecrew_requests');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      setRequests(initialMockRequests);
      localStorage.setItem('codecrew_requests', JSON.stringify(initialMockRequests));
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'user_current',
          email: email,
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
          college: 'Stanford University',
          year: 'Senior (4th Year)',
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python'],
          bio: 'Front-end enthusiast and open-source contributor. Currently building CodeCrew to help find hackers.',
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          role: 'student'
        };
        setCurrentUser(mockUser);
        localStorage.setItem('codecrew_user', JSON.stringify(mockUser));
        resolve(true);
      }, 500);
    });
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...userData,
          id: 'user_current',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
          role: 'student'
        };
        setCurrentUser(newUser);
        localStorage.setItem('codecrew_user', JSON.stringify(newUser));
        resolve(true);
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codecrew_user');
  };

  const sendInvite = (developerId: string, projectName: string, message: string) => {
    const newRequest: TeammateRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser?.id || 'user_current',
      senderName: currentUser?.name || 'Anonymous User',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
      receiverId: developerId,
      projectName: projectName || 'General Collaboration',
      message: message || 'Hey! I would love to collaborate on a project with you.',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem('codecrew_requests', JSON.stringify(updated));
  };

  const respondToInvite = (requestId: string, status: 'accepted' | 'declined') => {
    const updated = requests.map(req => 
      req.id === requestId ? { ...req, status } : req
    );
    setRequests(updated);
    localStorage.setItem('codecrew_requests', JSON.stringify(updated));
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    localStorage.setItem('codecrew_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      requests,
      login,
      register,
      logout,
      sendInvite,
      respondToInvite,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
