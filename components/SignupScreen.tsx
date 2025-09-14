import { ArrowLeft, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface SignupScreenProps {
  onGoBack: () => void;
}

export const SignupScreen = ({ onGoBack }: SignupScreenProps) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    classe: 'membro', 
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const { name, email, password, company, classe } = formData;
    if (!email || !password || !name || !company) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    const result = await signup({
      email,
      password,
      name,
      company,
      role: 'member',
      classe: classe as 'membro' | 'infinity' | 'sócio',
      // Preenchendo o resto com valores padrão
      location: '', sector: '', avatar: `https://i.pravatar.cc/150?u=${email}`, bio: '', revenue: '', age: 0, hasChildren: false, hobbies: '', experience: '', brands: '',
    });

    Alert.alert(result.success ? "Sucesso!" : "Erro no Cadastro", result.message);

    if (result.success) {
      onGoBack();
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#f5d142" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formulário de Cadastro</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} placeholder="Seu nome" value={formData.name} onChangeText={(v) => handleInputChange('name', v)} placeholderTextColor="#555"/>
        
        <Text style={styles.label}>Empresa</Text>
        <TextInput style={styles.input} placeholder="Nome da sua empresa" value={formData.company} onChangeText={(v) => handleInputChange('company', v)} placeholderTextColor="#555"/>
        
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="seu@email.com" value={formData.email} onChangeText={(v) => handleInputChange('email', v)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#555"/>
        
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="••••••••" value={formData.password} onChangeText={(v) => handleInputChange('password', v)} secureTextEntry placeholderTextColor="#555"/>
        
        <Text style={styles.label}>Qual classe você se identifica?</Text>
        <View style={styles.classeSelector}>
            {(['membro', 'infinity', 'sócio'] as const).map(c => (
                <TouchableOpacity key={c} onPress={() => handleInputChange('classe', c)} style={[styles.classeButton, formData.classe === c && styles.classeButtonSelected]}>
                    <Text style={[styles.classeText, formData.classe === c && styles.classeTextSelected]}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
          <UserPlus size={20} color="#1a1d2e" />
          <Text style={styles.submitButtonText}>Enviar para Análise</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1d2e' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a' },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
    form: { padding: 24 },
    label: { color: '#f0e6d2', marginBottom: 8, marginTop: 16, fontWeight: '600' },
    input: { backgroundColor: '#232842', color: '#f0e6d2', borderRadius: 8, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#2d325a' },
    classeSelector: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
    classeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#2d325a' },
    classeButtonSelected: { backgroundColor: '#eab308', borderColor: '#eab308' },
    classeText: { color: '#f0e6d2' },
    classeTextSelected: { color: '#1a1d2e', fontWeight: 'bold' },
    submitButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eab308', padding: 16, borderRadius: 8, marginTop: 32, justifyContent: 'center' },
    submitButtonText: { color: '#1a1d2e', marginLeft: 8, fontWeight: 'bold', fontSize: 16 },
});