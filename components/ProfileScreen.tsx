import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Adicionei a importação do ícone de voltar que estava faltando
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Building2, Calendar, Heart, LogOut, MapPin, MessageCircle, Star, Timer, TrendingUp, Users } from 'lucide-react-native';
import { mockUsers } from './data/mockData';

interface ProfileScreenProps {
  userId: string;
  onGoBack: () => void;
}

const InfoRow = ({ icon: Icon, label, value }: any) => (
  <View style={styles.infoBlock}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueRow}>
      <Icon size={16} color="#eab308" />
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export const ProfileScreen = ({ userId, onGoBack }: ProfileScreenProps) => {
  const { currentUser, logout } = useAuth(); // Pegue o usuário logado e a função de logout
  const userToDisplay = mockUsers.find(u => u.id === userId); // Encontra o usuário a ser exibido

  // Verifica se o perfil que estamos vendo é o do usuário atualmente logado
  const isOwnProfile = currentUser?.id === userId;

  if (!userToDisplay) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Usuário não encontrado.</Text>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#f5d142" />
        </TouchableOpacity>
      </View>
    );
  }
    
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* O botão de voltar aparece se NÃO for o perfil próprio */}
      {!isOwnProfile && (
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#f5d142" />
        </TouchableOpacity>
      )}

      {/* 3. O botão de Logout agora aparece se FOR o perfil próprio */}
      {isOwnProfile && (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <LogOut size={24} color="#ef4444" />
        </TouchableOpacity>
      )}

      {/* Profile Header */}
      <View style={[styles.premiumCard, styles.headerCard]}>
        <Image source={{ uri: userToDisplay.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{userToDisplay.name}</Text>
        <Text style={styles.company}>{userToDisplay.company}</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#a1a1aa" />
          <Text style={styles.location}>{userToDisplay.location}</Text>
        </View>
        <Text style={styles.bio}>{userToDisplay.bio}</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.premiumButton}>
            <MessageCircle size={20} color="#1a1d2e" />
            <Text style={styles.premiumButtonText}>Conectar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}>
            <Heart size={20} color="#f0e6d2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Professional Info */}
      <View style={styles.premiumCard}>
        <View style={styles.sectionHeader}>
          <Building2 size={22} color="#eab308" />
          <Text style={styles.sectionTitle}>Informações Profissionais</Text>
        </View>
        <View style={styles.infoValueRow}>
          <Star style={styles.classeText} size={16} color="#eab308" />
          <Text style={styles.classeText}>{userToDisplay.classe.charAt(0).toUpperCase() + userToDisplay.classe.slice(1)}</Text>
        </View>
        <View style={styles.infoGrid}>
          <InfoRow icon={TrendingUp} label="Faturamento" value={userToDisplay.revenue} />
          <InfoRow icon={Timer} label="Experiência" value={userToDisplay.experience} />
        </View>
        <Text style={styles.infoLabel}>Marcas Representadas</Text>
        <Text style={styles.infoValue}>{userToDisplay.brands}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.premiumCard}>
        <View style={styles.sectionHeader}>
          <Users size={22} color="#eab308" />
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        </View>
        <View style={styles.infoGrid}>
          <InfoRow icon={Calendar} label="Idade" value={`${userToDisplay.age} anos`} />
          <InfoRow icon={Heart} label="Filhos" value={userToDisplay.hasChildren ? "Sim" : "Não"} />
        </View>
        <Text style={styles.infoLabel}>Hobbies</Text>
        <Text style={styles.infoValue}>{userToDisplay.hobbies}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  premiumCard: { backgroundColor: '#232842', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(78, 88, 14, 0.5)', marginBottom: 16, padding: 20 },
  headerCard: { alignItems: 'center', paddingTop: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'rgba(234, 179, 8, 0.4)', marginBottom: 12 },
  name: { color: '#f0e6d2', fontSize: 22, fontWeight: 'bold' },
  company: { color: '#eab308', fontSize: 16, fontWeight: '500', marginVertical: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  location: { color: '#a1a1aa', fontSize: 14, marginLeft: 6 },
  bio: { color: '#d4d4d8', fontSize: 14, textAlign: 'center', marginVertical: 12 },
  actionContainer: { flexDirection: 'row', marginTop: 16 },
  premiumButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eab308', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  premiumButtonText: { color: '#1a1d2e', fontWeight: 'bold', marginLeft: 8 },
  outlineButton: { alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderWidth: 1, borderColor: '#2d325a', borderRadius: 8, marginLeft: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: '#f0e6d2', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  infoBlock: { flex: 1 },
  infoLabel: { color: '#a1a1aa', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { color: '#f0e6d2', fontSize: 14, fontWeight: '500', marginLeft: 6 },
  classeText: {
    color: '#eab308',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
    marginBottom: 16,
  },
  backButton: { position: 'absolute', top: 20, left: 16, zIndex: 10, padding: 8 },
  logoutButton: { position: 'absolute', top: 20, right: 16, zIndex: 10, padding: 8 },
});