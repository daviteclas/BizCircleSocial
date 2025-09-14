import { LogIn, UserPlus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GuestProfileScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export const GuestProfileScreen = ({ onNavigateToLogin, onNavigateToSignup }: GuestProfileScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comunidade</Text>
        <Text style={styles.headerSubtitle}>Acesse para conectar-se</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Você não está conectado</Text>
        <Text style={styles.description}>
          Entre na sua conta ou crie um novo cadastro para ter acesso a todas as funcionalidades exclusivas da comunidade.
        </Text>
        <TouchableOpacity style={styles.premiumButton} onPress={onNavigateToLogin}>
          <LogIn size={20} color="#1a1d2e" />
          <Text style={styles.premiumButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} onPress={onNavigateToSignup}>
          <UserPlus size={20} color="#f0e6d2" />
          <Text style={styles.outlineButtonText}>Quero me Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d2e' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  headerSubtitle: { fontSize: 12, color: '#a1a1aa' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#f0e6d2', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  description: { color: '#a1a1aa', textAlign: 'center', marginVertical: 16, lineHeight: 20 },
  premiumButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eab308', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, width: '100%', marginTop: 16 },
  premiumButtonText: { color: '#1a1d2e', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  outlineButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2d325a', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, width: '100%', marginTop: 16 },
  outlineButtonText: { color: '#f0e6d2', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
});