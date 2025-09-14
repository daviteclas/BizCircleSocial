import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { sectors } from './data/mockData';

interface SignupScreenProps {
  onGoBack: () => void;
  onSubmit: (userData: any) => Promise<void>;
}

export const SignupScreen = ({ onGoBack, onSubmit }: SignupScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    classe: 'membro',
    bio: '',
    location: '',
    sector: '',
    revenue: '',
    experience: '',
    brands: '',
    hobbies: '',
    avatarBase64: '', 
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "É preciso permitir o acesso à galeria.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!pickerResult.canceled) {
      handleInputChange('avatarBase64', `data:image/jpeg;base64,${pickerResult.assets[0].base64}`);
    }
  };

  const handleSignup = () => { // Não precisa mais ser async
    const { name, email, password, company, classe, bio, sector } = formData;
    if (!email || !password || !name || !company || !bio || !sector) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Apenas chama a função onSubmit que foi passada pelo MainNavigator
    onSubmit({
      email,
      password,
      name,
      company,
      role: 'member',
      classe: classe as 'membro' | 'infinity' | 'sócio',
      location: formData.location,
      sector: formData.sector,
      avatar: formData.avatarBase64,
      bio: formData.bio,
      revenue: formData.revenue,
      age: 0,
      hasChildren: false,
      hobbies: formData.hobbies,
      experience: formData.experience,
      brands: formData.brands,
    });

    // Remova os Alertas e a lógica de onGoBack daqui.
    // O MainNavigator cuidará disso.
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
        {/* Foto de Perfil */}
        <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
          {formData.avatarBase64 ? (
            <Image source={{ uri: formData.avatarBase64 }} style={styles.avatarPreview} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Camera size={40} color="#a1a1aa" />
              <Text style={styles.avatarPlaceholderText}>Foto de Perfil</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Informações Básicas */}
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        <Text style={styles.label}>Nome Completo*</Text>
        <TextInput style={styles.input} value={formData.name} onChangeText={(v) => handleInputChange('name', v)} placeholderTextColor="#555"/>
        <Text style={styles.label}>Email*</Text>
        <TextInput style={styles.input} value={formData.email} onChangeText={(v) => handleInputChange('email', v)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#555"/>
        <Text style={styles.label}>Senha*</Text>
        <TextInput style={styles.input} value={formData.password} onChangeText={(v) => handleInputChange('password', v)} secureTextEntry placeholderTextColor="#555"/>

        {/* Informações Profissionais */}
        <Text style={styles.sectionTitle}>Informações Profissionais</Text>
        <Text style={styles.label}>Empresa*</Text>
        <TextInput style={styles.input} value={formData.company} onChangeText={(v) => handleInputChange('company', v)} placeholderTextColor="#555"/>
        <Text style={styles.label}>Sua Biografia*</Text>
        <TextInput style={[styles.input, styles.textarea]} multiline value={formData.bio} onChangeText={(v) => handleInputChange('bio', v)} placeholderTextColor="#555"/>
        <Text style={styles.label}>Setor de Atuação*</Text>
        <View style={styles.badgeSelectorContainer}>
            {sectors.map((s) => (
                <TouchableOpacity key={s} onPress={() => handleInputChange('sector', s)} style={[styles.badge, formData.sector === s && styles.badgeActive]}>
                    <Text style={[styles.badgeText, formData.sector === s && styles.badgeTextActive]}>{s}</Text>
                </TouchableOpacity>
            ))}
        </View>
        <Text style={styles.label}>Faturamento Anual</Text>
        <TextInput style={styles.input} value={formData.revenue} onChangeText={(v) => handleInputChange('revenue', v)} placeholderTextColor="#555"/>
        <Text style={styles.label}>Marcas que Representa</Text>
        <TextInput style={styles.input} value={formData.brands} onChangeText={(v) => handleInputChange('brands', v)} placeholderTextColor="#555"/>
        <Text style={styles.label}>Tempo de Experiência</Text>
        <TextInput style={styles.input} value={formData.experience} onChangeText={(v) => handleInputChange('experience', v)} placeholderTextColor="#555"/>
        
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
    sectionTitle: { color: '#f5d142', fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, borderTopWidth: 1, borderTopColor: '#2d325a', paddingTop: 16 },
    label: { color: '#f0e6d2', marginBottom: 8, marginTop: 12, fontWeight: '600' },
    input: { backgroundColor: '#232842', color: '#f0e6d2', borderRadius: 8, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#2d325a' },
    textarea: { height: 100, textAlignVertical: 'top' },
    avatarPicker: { alignSelf: 'center', marginBottom: 16 },
    avatarPreview: { width: 120, height: 120, borderRadius: 60 },
    avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#232842', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2d325a', borderStyle: 'dashed' },
    avatarPlaceholderText: { color: '#a1a1aa', marginTop: 4, fontSize: 12 },
    badgeSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    badge: { backgroundColor: '#2d325a', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, },
    badgeActive: { backgroundColor: '#eab308' },
    badgeText: { color: '#f0e6d2', fontSize: 12 },
    badgeTextActive: { color: '#1a1d2e', fontWeight: 'bold' },
    classeSelector: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
    classeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#2d325a' },
    classeButtonSelected: { backgroundColor: '#eab308', borderColor: '#eab308' },
    classeText: { color: '#f0e6d2' },
    classeTextSelected: { color: '#1a1d2e', fontWeight: 'bold' },
    submitButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eab308', padding: 16, borderRadius: 8, marginTop: 32, justifyContent: 'center' },
    submitButtonText: { color: '#1a1d2e', marginLeft: 8, fontWeight: 'bold', fontSize: 16 },
});