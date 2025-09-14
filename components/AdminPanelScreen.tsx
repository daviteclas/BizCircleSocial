import { ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BusinessDeal, UserProfile } from './data/types';
import { ApprovalScreen } from './PostApprovalScreen'; // Renomeamos para clareza
import { UserApprovalScreen } from './UserApprovalScreen';

type AdminView = 'posts' | 'users';

interface AdminPanelScreenProps {
  pendingDeals: BusinessDeal[];
  pendingUsers: UserProfile[];
  onRefresh: () => void;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string) => void;
  onApproveUser: (userId: string, classe: 'membro' | 'infinity' | 'sócio') => void;
  onRejectUser: (userId: string) => void;
}

export const AdminPanelScreen = (props: AdminPanelScreenProps) => {
  const [activeView, setActiveView] = useState<AdminView>('posts');

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <ShieldCheck size={24} color="#f5d142" />
        <Text style={styles.headerTitle}>Painel do Administrador</Text>
      </View>

      {/* Filtro/Seletor de Análise */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeView === 'posts' && styles.filterButtonActive]}
          onPress={() => setActiveView('posts')}
        >
          <Text style={[styles.filterText, activeView === 'posts' && styles.filterTextActive]}>
            Análise de Posts ({props.pendingDeals.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeView === 'users' && styles.filterButtonActive]}
          onPress={() => setActiveView('users')}
        >
          <Text style={[styles.filterText, activeView === 'users' && styles.filterTextActive]}>
            Análise de Cadastros ({props.pendingUsers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Condicional */}
      {activeView === 'posts' ? (
        <ApprovalScreen
          deals={props.pendingDeals}
          onApprove={props.onApprovePost}
          onReject={props.onRejectPost}
        />
      ) : (
        <UserApprovalScreen
          pendingUsers={props.pendingUsers}
          onRefresh={props.onRefresh}
          onApprove={props.onApproveUser}
          onReject={props.onRejectUser}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b', flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1e223b',
        padding: 8,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    filterButtonActive: {
        backgroundColor: '#eab308',
    },
    filterText: {
        color: '#f0e6d2',
        fontWeight: 'bold',
    },
    filterTextActive: {
        color: '#1a1d2e',
    },
});