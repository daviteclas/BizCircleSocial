import { Check, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BusinessDeal } from './data/types';

interface ApprovalScreenProps {
  deals: BusinessDeal[];
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
}

export const ApprovalScreen = ({ deals, onApprove, onReject }: ApprovalScreenProps) => {
  // Filtra os posts para mostrar apenas os pendentes
  const pendingDeals = deals.filter(deal => deal.status === 'pending');

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aprovação de Posts</Text>
      </View>
      <FlatList
        data={pendingDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.premiumCard}>
            <Text style={styles.dealTitle}>{item.deal.title}</Text>
            <Text style={styles.dealParties}>{item.partyOne.company} & {item.partyTwo.company}</Text>
            <Text style={styles.dealDescription}>{item.deal.description}</Text>
            <View style={styles.actionContainer}>
              {/* Chama a função onApprove com o ID do item */}
              <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#166534'}]} onPress={() => onApprove(item.id)}>
                <Check color="white" size={20}/>
                <Text style={styles.buttonText}>Aprovar</Text>
              </TouchableOpacity>
              {/* Chama a função onReject com o ID do item */}
              <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#991b1b'}]} onPress={() => onReject(item.id)}>
                <X color="white" size={20}/>
                <Text style={styles.buttonText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum post pendente.</Text>}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  listContainer: { padding: 16 },
  premiumCard: { backgroundColor: '#232842', borderRadius: 12, padding: 16, marginBottom: 16 },
  dealTitle: { color: '#f0e6d2', fontWeight: 'bold', fontSize: 16 },
  dealParties: { color: '#a1a1aa', fontSize: 12, marginVertical: 4 },
  dealDescription: { color: '#d4d4d8', fontSize: 14, marginTop: 8 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: '#2d325a', paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  emptyText: { color: '#a1a1aa', textAlign: 'center', marginTop: 40 },
});