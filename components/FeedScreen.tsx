import { Stack } from 'expo-router';
import { Award, Handshake, MessageCircle, Plus, Search, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CURRENT_USER_ID, mockUsers, sectors } from './data/mockData';
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
  
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{item.stats.congrats} Parabéns</Text>
        <Text style={styles.statsText}>{item.stats.shares} Compartilhamentos</Text>
      </View>
  
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Award size={20} color="#eab308" />
          <Text style={[styles.actionText, { color: '#eab308' }]}>Parabenizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color="#a1a1aa" />
          <Text style={styles.actionText}>Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color="#a1a1aa" />
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

export const FeedScreen = ({ deals, onCreatePost }: FeedScreenProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Filtra para mostrar apenas posts aprovados
  const approvedDeals = deals.filter(deal => deal.status === 'approved');
  
  const currentUser = mockUsers.find(u => u.id === CURRENT_USER_ID);

  // Nova função para lidar com a seleção de categorias
  const handleSelectCategory = (category: string) => {
    // Se a categoria já está no array, remova-a
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      // Senão, adicione-a
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const filteredDeals = approvedDeals.filter(deal => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchesSearch = 
      deal.deal.title.toLowerCase().includes(lowerCaseSearch) ||
      deal.deal.description.toLowerCase().includes(lowerCaseSearch) ||
      deal.partyOne.company.toLowerCase().includes(lowerCaseSearch) ||
      deal.partyTwo.company.toLowerCase().includes(lowerCaseSearch);

    // 3. Lógica de filtro atualizada para múltiplas categorias
    const matchesCategory = 
      selectedCategories.length === 0 || // Se nenhuma categoria for selecionada, mostra tudo
      selectedCategories.includes(deal.deal.category); // Senão, verifica se a categoria do post está no array

    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.createdAt - a.createdAt);
  
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BusinessDealCard item={item} />}
        ListHeaderComponent={
          <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Negócios Fechados</Text>
                <Text style={styles.headerSubtitle}>Conexões que geram resultados</Text>
            </View>
            <View style={styles.filterSection}>
                <View style={styles.searchContainer}>
                    <Search color="#a1a1aa" size={20} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar por título, empresa..."
                        placeholderTextColor="#a1a1aa"
                        style={styles.input}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeContainer}>
                <TouchableOpacity onPress={() => setSelectedCategories([])}>
                    <View style={[styles.badge, selectedCategories.length === 0 ? styles.badgeActive : {}]}>
                    <Text style={[styles.badgeText, selectedCategories.length === 0 ? styles.badgeTextActive : {}]}>Todos</Text>
                    </View>
                </TouchableOpacity>
                    {sectors.map(sector => {
                      const isSelected = selectedCategories.includes(sector);
                      return (
                          <TouchableOpacity key={sector} onPress={() => handleSelectCategory(sector)}>
                              <View style={[styles.badge, isSelected ? styles.badgeActive : {}]}>
                                  <Text style={[styles.badgeText, isSelected ? styles.badgeTextActive : {}]}>{sector}</Text>
                              </View>
                          </TouchableOpacity>
                      );
                    })}
                </ScrollView>
            </View>
          </>
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum negócio encontrado.</Text>}
      />
      
      {currentUser?.role !== 'guest' && (
        <TouchableOpacity style={styles.fab} onPress={onCreatePost}>
          <Plus size={28} color="#1a1d2e" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#1e223b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  headerSubtitle: { fontSize: 12, color: '#a1a1aa', marginTop: 4 },
  filterSection: { backgroundColor: '#1e223b', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#2d325a'},
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#232842', borderRadius: 8, marginBottom: 16 },
  searchIcon: { marginHorizontal: 12 },
  input: { flex: 1, height: 44, color: '#f0e6d2', fontSize: 16 },
  badgeContainer: { paddingBottom: 8 },
  badge: { backgroundColor: '#2d325a', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, marginRight: 8 },
  badgeActive: { backgroundColor: '#eab308' },
  badgeText: { color: '#f0e6d2', fontSize: 12 },
  badgeTextActive: { color: '#1a1d2e', fontWeight: 'bold' },
  listContainer: { paddingBottom: 80 },
  premiumCard: { backgroundColor: '#232842', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(78, 88, 14, 0.5)', marginHorizontal: 16, marginTop: 16, padding: 16 },
  dealHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12, height: 60 },
  avatarLeft: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(234, 179, 8, 0.2)', zIndex: 1 },
  avatarRight: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(234, 179, 8, 0.2)', zIndex: 0 },
  handshakeIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eab308', justifyContent: 'center', alignItems: 'center', zIndex: 2, marginHorizontal: -12, borderWidth: 2, borderColor: '#232842' },
  dealParties: { textAlign: 'center', color: '#f0e6d2', fontWeight: 'bold', fontSize: 16, marginBottom: 16, },
  postContent: { marginBottom: 12, borderTopWidth: 1, borderTopColor: '#2d325a', paddingTop: 12 },
  dealHeaderInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dealCategory: { color: '#f0e6d2', fontSize: 12, fontWeight: 'bold', backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  dealValue: { color: '#eab308', fontSize: 12, fontWeight: 'bold' },
  dealTitle: { color: '#f0e6d2', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  postText: { color: '#d4d4d8', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginTop: 16, },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#2d325a' },
  statsText: { color: '#a1a1aa', fontSize: 12 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 8, color: '#a1a1aa', fontSize: 12, fontWeight: '500' },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#eab308', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, },
  emptyText: { color: '#a1a1aa', textAlign: 'center', marginTop: 40 },
});
