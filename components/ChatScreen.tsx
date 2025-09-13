import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Search, Send, ArrowLeft } from 'lucide-react-native';
import { mockChats } from './data/mockData'; // Importe os dados


export const ChatScreen = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  if (selectedChat) {
    const chat = mockChats.find(c => c.id === selectedChat);
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <ArrowLeft color="#f5d142" size={24} />
          </TouchableOpacity>
          <Image source={{ uri: chat?.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{chat?.name}</Text>
            <Text style={styles.company}>{chat?.company}</Text>
          </View>
        </View>
        <View style={styles.messagesContainer}>
          {/* Aqui viria a lista de mensagens */}
          <Text style={styles.placeholderText}>Mensagens da conversa...</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#a1a1aa"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send color="#1a1d2e" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversas</Text>
      </View>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.premiumCard} onPress={() => setSelectedChat(item.id)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            {item.online && <View style={styles.onlineIndicator} />}
            <View style={styles.textContainer}>
              <View style={styles.chatRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.infoText}>{item.timestamp}</Text>
              </View>
              <View style={styles.chatRow}>
                <Text style={styles.infoText} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unread && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>}
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
  listContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90 },
  premiumCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#232842', borderRadius: 12, marginBottom: 12, padding: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  onlineIndicator: { position: 'absolute', bottom: 16, left: 48, width: 14, height: 14, backgroundColor: '#22c55e', borderRadius: 7, borderWidth: 2, borderColor: '#232842' },
  textContainer: { flex: 1 },
  chatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#f0e6d2', fontWeight: 'bold', fontSize: 16 },
  company: { color: '#a1a1aa', fontSize: 12, },
  infoText: { color: '#a1a1aa', fontSize: 12, flexShrink: 1 },
  unreadBadge: { backgroundColor: '#eab308', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: '#1a1d2e', fontWeight: 'bold', fontSize: 10 },
  // Estilos para a tela de conversa
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b' },
  messagesContainer: { flex: 1, padding: 16 },
  placeholderText: { color: '#a1a1aa', textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#2d325a' },
  input: { flex: 1, height: 44, color: '#f0e6d2', fontSize: 16, backgroundColor: '#232842', borderRadius: 22, paddingHorizontal: 20 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eab308', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
});