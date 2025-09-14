import { Briefcase, MessageCircle, Search, ShieldCheck, Trophy, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppPage, UserProfile } from './data/types';

interface BottomNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  currentUser: UserProfile | null; // Alterado para aceitar nulo (convidado)
}

export const BottomNavigation = ({ currentPage, onNavigate, currentUser }: BottomNavigationProps) => {
  // Define todas as abas possíveis
  const allNavItems = [
    { id: "feed" as AppPage, icon: Briefcase, label: "Negócios", roles: ['guest', 'member', 'admin'] },
    { id: "ranking" as AppPage, icon: Trophy, label: "Ranking", roles: ['member', 'admin'] },
    { id: "search" as AppPage, icon: Search, label: "Buscar", roles: ['guest', 'member', 'admin'] },
    { id: "chat" as AppPage, icon: MessageCircle, label: "Chat", roles: ['member', 'admin'] },
    { id: "profile" as AppPage, icon: User, label: "Perfil", roles: ['guest', 'member', 'admin'] },
    { id: "approval" as AppPage, icon: ShieldCheck, label: "Admin", roles: ['admin'] },
  ];

  const userRole = currentUser ? currentUser.role : 'guest';

  // Filtra as abas que o usuário atual pode ver
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        const color = isActive ? '#eab308' : '#a1a1aa';

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onNavigate(item.id)}
            style={styles.button}
          >
            <Icon color={color} size={24} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: 80, backgroundColor: '#1e223b', borderTopWidth: 1, borderTopColor: '#2d325a', justifyContent: 'space-around', alignItems: 'center' },
  button: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, marginTop: 4 },
});