import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Users, Search, MessageCircle, User, Briefcase } from 'lucide-react-native';

export type AppPage = "feed" | "explore" | "search" | "chat" | "profile";

interface BottomNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export const BottomNavigation = ({ currentPage, onNavigate }: BottomNavigationProps) => {
  const navItems = [
    { id: "feed" as AppPage, icon: Briefcase, label: "Negócios" },
    { id: "search" as AppPage, icon: Search, label: "Buscar" },
    { id: "chat" as AppPage, icon: MessageCircle, label: "Chat" },
    { id: "profile" as AppPage, icon: User, label: "Perfil" }
  ];

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