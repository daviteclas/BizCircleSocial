// Adicione este tipo aqui para centralizar a navegação
export type AppPage = "feed" | "explore" | "search" | "chat" | "profile" | "approval" | "createPost" | "ranking";

// Adicione 'role' e 'status'
export type UserRole = 'guest' | 'member' | 'admin';
export type PostStatus = 'pending' | 'approved' | 'rejected';

// Define o perfil básico de um usuário/empresa
export interface UserProfile {
  id: string;
  name: string;
  company: string;
  location: string;
  sector: string;
  avatar: string;
  bio: string;
  revenue: string;
  age: number;
  hasChildren: boolean;
  hobbies: string;
  experience: string;
  brands: string;
  role: UserRole;
  classe: 'membro' | 'infinity' | 'sócio';
  experiencePoints: number; 
}

// Define a estrutura para um post de negócio fechado no feed
export interface BusinessDeal {
  id: string;
  partyOne: { id: string; name: string; company: string; avatar: string; };
  partyTwo: { id: string; name: string; company: string; avatar: string; };
  deal: {
    title: string;
    description: string;
    category: string;
    value: string;
    image?: string;
  };
  stats: {
    congrats: number;
    shares: number;
  };
  status: PostStatus; 
  createdAt: number; 
}

// Define a estrutura para a lista de chats
export interface ChatUser {
  id: string;
  name: string;
  company: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  avatar: string;
}