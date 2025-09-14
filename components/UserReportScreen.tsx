import { ArrowLeft, BarChart2, DollarSign, Handshake, Star } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockUsers } from './data/mockData';

interface ReportScreenProps {
  userId: string;
  onGoBack: () => void;
}

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <View style={styles.statCard}>
    <Icon size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const UserReportScreen = ({ userId, onGoBack }: ReportScreenProps) => {
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Relatório não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <ArrowLeft size={24} color="#f5d142" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Relatório de Atividade</Text>
          <Text style={styles.headerSubtitle}>{user.name}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          <StatCard icon={Star} label="Pontos de Experiência" value={user.experiencePoints} color="#f5d142" />
          <StatCard icon={Handshake} label="Negócios Fechados" value="12" color="#34d399" />
          <StatCard icon={DollarSign} label="Faturamento Gerado (est.)" value="R$ 1.2M" color="#60a5fa" />
          <StatCard icon={BarChart2} label="Engajamento (posts)" value="85%" color="#fb923c" />
        </View>

        <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Detalhes Adicionais</Text>
            <Text style={styles.detailText}>• Principal parceiro de negócios: Inovare Consultoria</Text>
            <Text style={styles.detailText}>• Setor mais ativo: Tecnologia</Text>
            <Text style={styles.detailText}>• Mês com mais negociações: Agosto</Text>
            <Text style={styles.detailText}>• Média de propostas por negócio: 4</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d2e' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  headerSubtitle: { fontSize: 14, color: '#a1a1aa' },
  content: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: '#232842',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d325a',
  },
  statValue: { color: '#f0e6d2', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  statLabel: { color: '#a1a1aa', fontSize: 12, textAlign: 'center' },
  detailSection: { marginTop: 24, backgroundColor: '#232842', borderRadius: 12, padding: 16 },
  sectionTitle: { color: '#f0e6d2', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  detailText: { color: '#d4d4d8', fontSize: 14, marginBottom: 8, lineHeight: 20 },
});