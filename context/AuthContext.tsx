import { mockUsers } from '@/components/data/mockData';
import { UserProfile } from '@/components/data/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o que o nosso Contexto vai fornecer para os componentes
interface AuthContextType {
  currentUser: UserProfile | null; // Pode ser um usuário ou nulo (convidado)
  login: (email: string, pass: string) => boolean; // Função de login
  logout: () => void; // Função de logout
}

// Cria o Contexto com um valor inicial nulo
const AuthContext = createContext<AuthContextType | null>(null);

// Cria o "Provedor" do nosso contexto. É ele que vai envolver o aplicativo.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // O estado que guarda a informação do usuário logado
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Função de Login (Simulada)
  const login = (email: string, pass: string): boolean => {
    // Em um app real, você buscaria no banco de dados.
    // Aqui, vamos apenas encontrar um usuário no nosso mock.
    // Vamos simular que o usuário com id '1' (Carlos Silva) é o único que consegue logar.
    const userToLogin = mockUsers.find(u => u.id === '1');

    if (userToLogin) { // Simplesmente fingimos que a senha está correta
      setCurrentUser(userToLogin);
      console.log('Login bem-sucedido:', userToLogin.name);
      return true;
    }
    
    console.log('Falha no login');
    return false;
  };

  // Função de Logout
  const logout = () => {
    setCurrentUser(null);
    console.log('Usuário deslogado.');
  };

  // O valor que será compartilhado com todos os componentes dentro do Provider
  const value = {
    currentUser,
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