import { Check, Edit, UserCheck, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserProfile } from './data/types';

interface UserApprovalScreenProps {
  pendingUsers: UserProfile[];
  onRefresh: () => void;
  onApprove: (userId: string, classe: 'membro' | 'infinity' | 'sócio') => void;
  onReject: (userId: string) => void;
}

export const UserApprovalScreen = ({ pendingUsers, onRefresh, onApprove, onReject }: UserApprovalScreenProps) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedClasse, setSelectedClasse] = useState<'membro' | 'infinity' | 'sócio'>('membro');

  const openModal = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedClasse(user.classe); // Inicia o seletor com a classe que o usuário pediu
  };

  const handleApprove = () => {
    if (selectedUser) {
      onApprove(selectedUser.id, selectedClasse);
      setSelectedUser(null); // Fecha o modal
    }
  };

  const handleReject = () => {
    if (selectedUser) {
      Alert.alert(
        "Confirmar Rejeição",
        `Tem certeza que deseja rejeitar o cadastro de ${selectedUser.name}? Esta ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Rejeitar", style: "destructive", onPress: () => {
              onReject(selectedUser.id);
              setSelectedUser(null); // Fecha o modal
            }
          }
        ]
      );
    }
  };

  return (
    <>
      <View style={styles.header}>
        <UserCheck size={24} color="#f5d142" />
        <Text style={styles.headerTitle}>Aprovação de Cadastros</Text>
      </View>
      <FlatList
        data={pendingUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // O card agora abre o modal de detalhes/ação
          <TouchableOpacity style={styles.premiumCard} onPress={() => openModal(item)}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.company}>{item.company}</Text>
                <Text style={styles.requestedClass}>Solicitou: <Text style={{fontWeight: 'bold'}}>{item.classe}</Text></Text>
              </View>
              <Edit size={20} color="#a1a1aa" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cadastro pendente.</Text>}
        onRefresh={onRefresh}
        refreshing={false} // Supondo que o loading é gerenciado pelo componente pai
      />

      {/* Modal de Aprovação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedUser}
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Analisar Cadastro</Text>
            {selectedUser && (
              <>
                <Text style={styles.detailLabel}>Nome:</Text>
                <Text style={styles.detailValue}>{selectedUser.name}</Text>
                <Text style={styles.detailLabel}>Empresa:</Text>
                <Text style={styles.detailValue}>{selectedUser.company}</Text>
                <Text style={styles.detailLabel}>Classe Solicitada:</Text>
                <Text style={styles.detailValue}>{selectedUser.classe}</Text>
                
                <Text style={styles.label}>Definir Classe:</Text>
                <View style={styles.classeSelector}>
                    {(['membro', 'infinity', 'sócio'] as const).map(c => (
                        <TouchableOpacity key={c} onPress={() => setSelectedClasse(c)} style={[styles.classeButton, selectedClasse === c && styles.classeButtonSelected]}>
                            <Text style={[styles.classeText, selectedClasse === c && styles.classeTextSelected]}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.modalActionContainer}>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#991b1b'}]} onPress={handleReject}>
                        <X color="white" size={20}/>
                        <Text style={styles.buttonText}>Rejeitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#166534'}]} onPress={handleApprove}>
                        <Check color="white" size={20}/>
                        <Text style={styles.buttonText}>Aprovar</Text>
                    </TouchableOpacity>
                </View>
              </>
            )}
             <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedUser(null)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b', flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
    listContainer: { padding: 16, paddingBottom: 90 },
    premiumCard: { backgroundColor: '#232842', borderRadius: 12, padding: 16, marginBottom: 16 },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    textContainer: { flex: 1 },
    name: { color: '#f0e6d2', fontWeight: 'bold', fontSize: 16 },
    company: { color: '#a1a1aa', fontSize: 12 },
    requestedClass: { color: '#eab308', fontSize: 12, fontStyle: 'italic', marginTop: 4 },
    emptyText: { color: '#a1a1aa', textAlign: 'center', marginTop: 40 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { backgroundColor: '#1e223b', borderRadius: 12, padding: 24, width: '90%', borderWidth: 1, borderColor: '#2d325a' },
    modalTitle: { color: '#f0e6d2', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    detailLabel: { color: '#a1a1aa', fontSize: 12, marginTop: 8 },
    detailValue: { color: '#f0e6d2', fontSize: 16, marginBottom: 8 },
    label: { color: '#f0e6d2', marginBottom: 8, marginTop: 16, fontWeight: '600' },
    classeSelector: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, marginBottom: 24 },
    classeButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#2d325a' },
    classeButtonSelected: { backgroundColor: '#eab308', borderColor: '#eab308' },
    classeText: { color: '#f0e6d2' },
    classeTextSelected: { color: '#1a1d2e', fontWeight: 'bold' },
    modalActionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
    closeButton: { marginTop: 20, padding: 8 },
    closeButtonText: { color: '#a1a1aa', textAlign: 'center' },
});