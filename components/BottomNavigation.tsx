import { Briefcase, MessageCircle, Search, ShieldCheck, Trophy, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppPage, UserProfile } from './data/types';

interface BottomNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  currentUser: UserProfile | undefined;
}

export const BottomNavigation = ({ currentPage, onNavigate, currentUser }: BottomNavigationProps) => {
  const navItems = [
    { id: "feed" as AppPage, icon: Briefcase, label: "Negócios" },
    { id: "search" as AppPage, icon: Search, label: "Buscar" },
    { id: "chat" as AppPage, icon: MessageCircle, label: "Chat" },
    { id: "profile" as AppPage, icon: User, label: "Perfil" },
    { id: "ranking" as AppPage, icon: Trophy, label: "Ranking" },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: "approval" as AppPage, icon: ShieldCheck, label: "Admin" });
  }

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
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#1e223b',
    borderTopWidth: 1,
    borderTopColor: '#2d325a',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 4,
  },
});