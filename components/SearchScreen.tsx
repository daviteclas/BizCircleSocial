import { Building2, MapPin, Search } from 'lucide-react-native';
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
import { mockUsers, sectors } from './data/mockData';

interface SearchScreenProps {
  onSelectUser: (userId: string) => void;
}

export const SearchScreen = ({ onSelectUser }: SearchScreenProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = !selectedSector || user.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Membros</Text>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <Search color="#a1a1aa" size={20} style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar por nome ou empresa..."
                placeholderTextColor="#a1a1aa"
                style={styles.input}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <Text style={styles.filterTitle}>Filtrar por Setor</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeContainer}>
              <TouchableOpacity onPress={() => setSelectedSector(null)}>
                <View style={[styles.badge, !selectedSector ? styles.badgeActive : {}]}>
                  <Text style={[styles.badgeText, !selectedSector ? styles.badgeTextActive : {}]}>Todos</Text>
                </View>
              </TouchableOpacity>
              {sectors.map(sector => (
                <TouchableOpacity key={sector} onPress={() => setSelectedSector(sector)}>
                  <View style={[styles.badge, selectedSector === sector ? styles.badgeActive : {}]}>
                    <Text style={[styles.badgeText, selectedSector === sector ? styles.badgeTextActive : {}]}>{sector}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.premiumCard} 
            onPress={() => onSelectUser(item.id)}
          >
            <View style={styles.cardContent}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.infoRow}>
                  <Building2 size={14} color="#a1a1aa" />
                  <Text style={styles.infoText}>{item.company}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={14} color="#a1a1aa" />
                  <Text style={styles.infoText}>{item.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
};


const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 90 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#232842', borderRadius: 8, marginVertical: 16 },
  searchIcon: { marginHorizontal: 12 },
  input: { flex: 1, height: 44, color: '#f0e6d2', fontSize: 16 },
  filterTitle: { color: '#f0e6d2', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  badgeContainer: { paddingBottom: 16 },
  badge: { backgroundColor: '#2d325a', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, marginRight: 8 },
  badgeActive: { backgroundColor: '#eab308' },
  badgeText: { color: '#f0e6d2', fontSize: 12 },
  badgeTextActive: { color: '#1a1d2e', fontWeight: 'bold' },
  premiumCard: { backgroundColor: '#232842', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(78, 88, 14, 0.5)', marginBottom: 12, padding: 16 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  textContainer: { flex: 1, marginLeft: 12 },
  name: { color: '#f0e6d2', fontWeight: 'bold', fontSize: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { color: '#a1a1aa', fontSize: 12, marginLeft: 6 },
});