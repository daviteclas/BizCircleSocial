import { createUser, findUserByEmail, findUserByEmailAndPassword, getUserById } from '@/components/data/database';
import { UserProfile } from '@/components/data/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';


// Define o que o nosso Contexto vai fornecer para os componentes
interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: Omit<UserProfile, 'id' | 'experiencePoints' | 'status'>) => Promise<{ success: boolean; message: string }>;
}

// Cria o Contexto com um valor inicial nulo
const AuthContext = createContext<AuthContextType | null>(null);

// Cria o "Provedor" do nosso contexto. É ele que vai envolver o aplicativo.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Este useEffect roda uma vez quando o app abre para verificar se há um usuário logado
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem('loggedUserId');
        if (userId) {
          const userFromDb = await getUserById(userId);
          if (userFromDb) {
            setCurrentUser(userFromDb);
          }
        }
      } catch (e) {
        console.error("Falha ao carregar usuário do storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    const userFromDb = await findUserByEmailAndPassword(email, pass);
    if (userFromDb && userFromDb.status === 'approved') {
      setCurrentUser(userFromDb);
      await AsyncStorage.setItem('loggedUserId', userFromDb.id);
      return true;
    }
    return false;
  };

  // Função de Logout
  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem('loggedUserId');
  };

  const signup = async (userData: Omit<UserProfile, 'id' | 'experiencePoints' | 'status'>): Promise<{ success: boolean; message: string }> => {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, message: 'Este endereço de email já está em uso.' };
    }

    try {
      const newUser: Omit<UserProfile, 'id'> = {
        ...userData,
        experiencePoints: 0,
        status: 'pending',
      };
      await createUser(newUser);
      // E tem um 'return' aqui
      return { success: true, message: 'Cadastro enviado para análise! Você será notificado quando for aprovado.' };
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      // E tem um 'return' aqui também
      return { success: false, message: 'Ocorreu um erro ao realizar o cadastro.' };
    }
  };
  
  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    signup, 
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto em outras telas
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
