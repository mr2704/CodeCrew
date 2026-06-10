export interface User {
  id: string;
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

export interface Developer {
  id: string;
  name: string;
  college: string;
  year: string; // e.g. "Sophomore", "Senior", "3rd Year"
  skills: string[];
  bio: string;
  github: string;
  linkedin: string;
  avatar: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdBy: string; // user ID
  status: 'planning' | 'in-progress' | 'completed';
}

export interface TeammateRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  projectName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}
