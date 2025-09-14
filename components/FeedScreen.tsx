import { Stack } from 'expo-router';
import { Handshake, Plus } from 'lucide-react-native';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CURRENT_USER_ID, mockUsers } from './data/mockData';
import { BusinessDeal } from './data/types';

interface FeedScreenProps {
  deals: BusinessDeal[];
  onCreatePost: () => void;
}

const BusinessDealCard = ({ item }: { item: BusinessDeal }) => (
  <View style={styles.premiumCard}>
    <View style={styles.dealHeader}>
      <Image source={{ uri: item.partyOne.avatar }} style={styles.avatarLeft} />
      <View style={styles.handshakeIcon}>
        <Handshake size={24} color="#1a1d2e" />
      </View>
      <Image source={{ uri: item.partyTwo.avatar }} style={styles.avatarRight} />
    </View>
    <Text style={styles.dealParties}>
      {item.partyOne.company} & {item.partyTwo.company}
    </Text>

    <View style={styles.postContent}>
      <View style={styles.dealHeaderInfo}>
        <Text style={styles.dealCategory}>{item.deal.category}</Text>
        <Text style={styles.dealValue}>{item.deal.value}</Text>
      </View>
      <Text style={styles.dealTitle}>{item.deal.title}</Text>
      <Text style={styles.postText}>{item.deal.description}</Text>
      {item.deal.image && (
        <Image source={{ uri: item.deal.image }} style={styles.postImage} />
      )}
    </View>

  </View>
);

export const FeedScreen = ({ deals, onCreatePost }: FeedScreenProps) => {
  // Filtra para mostrar apenas posts aprovados
  const approvedDeals = deals.filter(deal => deal.status === 'approved').sort((a, b) => b.createdAt - a.createdAt);
  const currentUser = mockUsers.find(u => u.id === CURRENT_USER_ID);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Negócios Fechados</Text>
        <Text style={styles.headerSubtitle}>Conexões que geram resultados</Text>
      </View>
      <FlatList
        data={approvedDeals}
        renderItem={({ item }) => <BusinessDealCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        style={{ flex: 1 }}
      />
      {/* Botão flutuante para criar post (visível para membros e admins) */}
      {currentUser?.role !== 'guest' && (
        <TouchableOpacity style={styles.fab} onPress={onCreatePost}>
          <Plus size={28} color="#1a1d2e" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100, // Acima da barra de navegação
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eab308',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  headerSubtitle: { fontSize: 12, color: '#a1a1aa' },
  listContainer: { padding: 16, paddingBottom: 80 },
  premiumCard: { backgroundColor: '#232842', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(78, 88, 14, 0.5)', marginBottom: 16, padding: 16 },
  dealHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12, height: 60 },
  avatarLeft: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(234, 179, 8, 0.2)', zIndex: 1 },
  avatarRight: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(234, 179, 8, 0.2)', zIndex: 0 },
  handshakeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eab308',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginHorizontal: -12,
    borderWidth: 2,
    borderColor: '#232842'
  },
  dealParties: {
    textAlign: 'center',
    color: '#f0e6d2',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
  },
  postContent: { marginBottom: 12, borderTopWidth: 1, borderTopColor: '#2d325a', paddingTop: 12 },
  dealHeaderInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dealCategory: { color: '#f0e6d2', fontSize: 12, fontWeight: 'bold', backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  dealValue: { color: '#eab308', fontSize: 12, fontWeight: 'bold' },
  dealTitle: { color: '#f0e6d2', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  postText: { color: '#d4d4d8', fontSize: 14, lineHeight: 20, textAlign: 'center' },

  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 16,
  },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#2d325a' },
  statsText: { color: '#a1a1aa', fontSize: 12 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 8, color: '#a1a1aa', fontSize: 12, fontWeight: '500' },
});