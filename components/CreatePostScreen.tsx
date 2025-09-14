import * as ImagePicker from 'expo-image-picker'; // 1. Importe o ImagePicker
import { ArrowLeft, Camera, Send, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserProfile } from './data/types';

interface CreatePostScreenProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onGoBack: () => void;
  onSubmit: (newDeal: any) => void;
}

export const CreatePostScreen = ({ currentUser, allUsers, onGoBack, onSubmit }: CreatePostScreenProps) => {
  // Estados para controlar o formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [imageBase64, setImageBase64] = useState<string | null>(null); // Estado para a imagem

  const handlePickImage = async () => {
    // Pede permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para adicionar uma imagem.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduz a qualidade para gerar uma string Base64 menor
      base64: true,  // Ponto chave: solicita a imagem em Base64
    });

    if (!pickerResult.canceled) {
      // Salva a string Base64 no estado
      setImageBase64(`data:image/jpeg;base64,${pickerResult.assets[0].base64}`);
    }
  };

  // Filtra o usuário atual da lista de parceiros
  const potentialPartners = allUsers.filter(u => u.id !== currentUser.id && u.role !== 'guest');

  const handleSelectPartner = (user: UserProfile) => {
    setPartner(user);
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (!title || !description || !partner) {
      alert('Por favor, preencha o título, descrição e selecione um parceiro.');
      return;
    }
    const newDeal = {
      partyOne: { name: currentUser.name, company: currentUser.company, avatar: currentUser.avatar },
      partyTwo: { name: partner.name, company: partner.company, avatar: partner.avatar },
      deal: {
        title,
        description,
        category,
        value,
        image: imageBase64, // Adiciona a string Base64 ao objeto do negócio
      },
      stats: { congrats: 0, shares: 0 },
    };
    onSubmit(newDeal);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#f5d142" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Post de Negócio</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Título do Negócio</Text>
          <TextInput style={styles.input} placeholder="Ex: Parceria Estratégica" placeholderTextColor="#555" value={title} onChangeText={setTitle} />
          
          <Text style={styles.label}>Descrição</Text>
          <TextInput style={[styles.input, styles.textarea]} multiline placeholder="Descreva o negócio fechado..." placeholderTextColor="#555" value={description} onChangeText={setDescription} />
          
          <Text style={styles.label}>Categoria</Text>
          <TextInput style={styles.input} placeholder="Ex: Investimento (Seed)" placeholderTextColor="#555" value={category} onChangeText={setCategory} />

          <Text style={styles.label}>Valor (opcional)</Text>
          <TextInput style={styles.input} placeholder="Ex: R$ 100.000" placeholderTextColor="#555" value={value} onChangeText={setValue} />
          
        <TouchableOpacity style={styles.userSelectButton} onPress={handlePickImage}>
        <Camera size={20} color="#eab308" />
        <Text style={styles.userSelectText}>Adicionar Foto do Negócio</Text>
        </TouchableOpacity>

        {imageBase64 && (
        <Image source={{ uri: imageBase64 }} style={styles.imagePreview} />
        )}
          
          <TouchableOpacity style={styles.userSelectButton} onPress={() => setModalVisible(true)}>
            <UserPlus size={20} color="#eab308" />
            <Text style={styles.userSelectText}>
              {partner ? `Marcado: ${partner.name}` : 'Marcar Sócio ou Empresa'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Send size={20} color="#1a1d2e" />
            <Text style={styles.submitButtonText}>Enviar para Análise</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para Selecionar Parceiro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Parceiro</Text>
            <FlatList
              data={potentialPartners}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.partnerItem} onPress={() => handleSelectPartner(item)}>
                  <Image source={{ uri: item.avatar }} style={styles.partnerAvatar} />
                  <View>
                    <Text style={styles.partnerName}>{item.name}</Text>
                    <Text style={styles.partnerCompany}>{item.company}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d2e' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
  form: { padding: 16 },
  label: { color: '#f0e6d2', marginBottom: 8, marginTop: 16, fontWeight: '600' },
  input: { backgroundColor: '#232842', color: '#f0e6d2', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#2d325a' },
  textarea: { height: 100, textAlignVertical: 'top' },
  userSelectButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#232842', padding: 12, borderRadius: 8, marginTop: 24, justifyContent: 'center', borderWidth: 1, borderColor: '#2d325a' },
  userSelectText: { color: '#eab308', marginLeft: 8, fontWeight: 'bold' },
  submitButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eab308', padding: 16, borderRadius: 8, marginTop: 32, justifyContent: 'center' },
  submitButtonText: { color: '#1a1d2e', marginLeft: 8, fontWeight: 'bold', fontSize: 16 },
  
  // Estilos do Modal
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1e223b', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, height: '70%' },
  modalTitle: { color: '#f0e6d2', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  partnerItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2d325a' },
  partnerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  partnerName: { color: '#f0e6d2', fontSize: 16, fontWeight: 'bold' },
  partnerCompany: { color: '#a1a1aa', fontSize: 12 },
  closeButton: { padding: 16, alignItems: 'center' },
  closeButtonText: { color: '#eab308', fontSize: 16, fontWeight: 'bold' },

  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2d325a'
  },
});
