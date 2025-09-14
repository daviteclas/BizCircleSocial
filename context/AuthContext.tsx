import { findUserByEmailAndPassword, getUserById } from '@/components/data/database';
import { UserProfile } from '@/components/data/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';


// Define o que o nosso Contexto vai fornecer para os componentes
interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean; // Para mostrar um loading inicial
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  // Adicionaremos a função de signup na próxima etapa
}

// Cria o Contexto com um valor inicial nulo
const AuthContext = createContext<AuthContextType | null>(null);

// Cria o "Provedor" do nosso contexto. É ele que vai envolver o aplicativo.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  // Este useEffect roda uma vez quando o app abre para verificar se há um usuário logado
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem('loggedUserId');
        if (userId) {
          // Se encontramos um ID, buscamos os dados completos do usuário no BD
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
      // Salva o ID do usuário no AsyncStorage para mantê-lo logado
      await AsyncStorage.setItem('loggedUserId', userFromDb.id);
      return true;
    }
    
    // Você pode adicionar lógicas aqui para avisar se o usuário está pendente, etc.
    return false;
  };

  // Função de Logout
  const logout = async () => {
    setCurrentUser(null);
    // Remove o ID do AsyncStorage para deslogar
    await AsyncStorage.removeItem('loggedUserId');
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
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
