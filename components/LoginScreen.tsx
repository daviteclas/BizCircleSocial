import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft, LogIn } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onGoBack: () => void;
}

export const LoginScreen = ({ onGoBack }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    const success = await login(email, password);
    if (!success) {
      Alert.alert("Falha no Login", "Email ou senha incorretos, ou seu cadastro ainda não foi aprovado.");
    }
    // Se o login for bem-sucedido, o AuthContext irá automaticamente redirecionar o usuário.
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#f5d142" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <LogIn size={20} color="#1a1d2e" />
          <Text style={styles.submitButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1d2e' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a' },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
    form: { padding: 24, flex: 1, justifyContent: 'center' },
    label: { color: '#f0e6d2', marginBottom: 8, marginTop: 16, fontWeight: '600' },
    input: { backgroundColor: '#232842', color: '#f0e6d2', borderRadius: 8, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#2d325a' },
    submitButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eab308', padding: 16, borderRadius: 8, marginTop: 32, justifyContent: 'center' },
    submitButtonText: { color: '#1a1d2e', marginLeft: 8, fontWeight: 'bold', fontSize: 16 },
});