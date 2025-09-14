import { addExperiencePoints, getDeals, getUsers, insertDeal, setupDatabase, updateDatabaseSchema, updateDealStatus } from '@/components/data/database';
import { AppPage, BusinessDeal, UserProfile } from '@/components/data/types';
import { RankingScreen } from '@/components/RankingScreen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ApprovalScreen } from './components/ApprovalScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { ChatScreen } from './components/ChatScreen';
import { CreatePostScreen } from './components/CreatePostScreen';
import { mockUsers } from './components/data/mockData';
import { FeedScreen } from './components/FeedScreen';
import { GuestProfileScreen } from './components/GuestProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SearchScreen } from './components/SearchScreen';
import { SignupScreen } from './components/SignupScreen';
import { useAuth } from './context/AuthContext';

// Um componente simples para telas bloqueadas
const BlockedScreen = ({ message }: { message: string }) => (
  <View style={styles.blockedContainer}>
    <Text style={styles.blockedTitle}>Acesso Restrito</Text>
    <Text style={styles.blockedMessage}>{message}</Text>
  </View>
);

export default function MainNavigator() {
  const { currentUser, isLoading } = useAuth();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [businessDeals, setBusinessDeals] = useState<BusinessDeal[]>([]);

  // Estado para controlar a navegação dentro da aba de perfil do convidado
  const [authPage, setAuthPage] = useState<'guest' | 'login' | 'signup'>('guest');
  
  const handleSelectUser = (userId: string) => {
    if (!currentUser) {
      handleGuestAction();
    } else {
      setViewingUserId(userId);
    }
  };

  const handleGoBack = () => setViewingUserId(null);
  const handleNavigateCreatePost = () => setCurrentPage('createPost');

  useEffect(() => {
    async function initialize() {
      await updateDatabaseSchema();

    //   await resetDatabase(); 
      await setupDatabase();
      
      const [dealsFromDb, usersFromDb] = await Promise.all([getDeals(), getUsers()]);
      setBusinessDeals(dealsFromDb);
      setAllUsers(usersFromDb);
      setDbInitialized(true);
    }
    initialize();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setCurrentPage('feed');
      setAuthPage('guest'); 
    }
  }, [currentUser]);


  // Função para lidar com ações que um convidado não pode fazer
  const handleGuestAction = () => {
    Alert.alert(
      "Acesso Exclusivo para Membros",
      "Crie uma conta ou faça login para interagir com os membros.",
      [{ text: "OK", onPress: () => setCurrentPage('profile') }] // Leva o usuário para a tela de login/cadastro
    );
  };

  // Lógica para aprovar um post
  const handleApprovePost = async (dealId: string) => {
    const dealToApprove = businessDeals.find(d => d.id === dealId);
    if (dealToApprove) {
        // Adiciona 100 pontos para cada parte do negócio
        await Promise.all([
            addExperiencePoints(dealToApprove.partyOne.id, 100),
            addExperiencePoints(dealToApprove.partyTwo.id, 100),
            console.log(dealToApprove.partyOne.id),
            console.log(dealToApprove.partyTwo.id),
            updateDealStatus(dealId, 'approved')
        ]);
        // Recarrega os dados para refletir as mudanças
        const [updatedDeals, updatedUsers] = await Promise.all([getDeals(), getUsers()]);
        setBusinessDeals(updatedDeals);
        setAllUsers(updatedUsers);
    }
  };

  // Lógica para rejeitar (remover) um post
  const handleRejectPost = async (postId: string) => {
    await updateDealStatus(postId, 'rejected');
    const updatedDeals = await getDeals(); // Recarrega os dados do BD
    setBusinessDeals(updatedDeals);
  };
  
  // Função para "salvar" o post e voltar ao feed
  const handleSubmitPost = async (newDealData: any) => {
      const newDeal = {
          ...newDealData,
          status: 'pending',
      };
      await insertDeal(newDeal);
      const updatedDeals = await getDeals(); // Recarrega os dados do BD
      setBusinessDeals(updatedDeals);
      setCurrentPage('feed');
  };

  if (isLoading || !dbInitialized) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#eab308"/></View>;
  }

  // Se for convidado (ninguém logado)
  if (!currentUser) {
    if (currentPage === 'profile') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" />
                {authPage === 'guest' && <GuestProfileScreen onNavigateToLogin={() => setAuthPage('login')} onNavigateToSignup={() => setAuthPage('signup')} />}
                {authPage === 'login' && <LoginScreen onGoBack={() => setAuthPage('guest')} />}
                {authPage === 'signup' && <SignupScreen onGoBack={() => setAuthPage('guest')} />}
            </SafeAreaView>
        );
    }
    // Para convidados, as outras abas podem mostrar uma tela bloqueada ou o feed
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <FeedScreen deals={businessDeals} onCreatePost={() => {}}/>
        <BottomNavigation 
            currentPage={currentPage} 
            onNavigate={setCurrentPage}
            currentUser={currentUser}
        />
      </SafeAreaView>
    );
  }
  
  if (viewingUserId) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileScreen userId={viewingUserId} onGoBack={() => setViewingUserId(null)} />
      </SafeAreaView>
    );
  }

  const renderPage = () => {
    const userRole = currentUser ? currentUser.role : 'guest';
    switch (currentPage) {
      case 'createPost':
        // Passa o usuário atual e a lista de todos os usuários para a tela de criação
        return (
          <CreatePostScreen 
            currentUser={currentUser!}
            allUsers={mockUsers}
            onGoBack={() => setCurrentPage('feed')} 
            onSubmit={handleSubmitPost} 
          />
        );
      case 'approval':
        if (userRole !== 'admin') return <BlockedScreen message="Esta área é restrita para administradores." />;
        return <ApprovalScreen deals={businessDeals} onApprove={handleApprovePost} onReject={handleRejectPost} />;
      case 'feed':
        return <FeedScreen deals={businessDeals} onCreatePost={handleNavigateCreatePost} currentUser={currentUser} />;
      case 'search':
        return <SearchScreen onSelectUser={handleSelectUser} />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        if (userRole === 'guest') {
          // Aqui podemos adicionar as telas de login/cadastro depois
          return <GuestProfileScreen onNavigateToLogin={() => {}} onNavigateToSignup={() => {}} />;
        }
        return <ProfileScreen userId={currentUser.id} onGoBack={() => {}} />;
      case 'ranking':
      case 'chat':
        if (userRole === 'guest') return <BlockedScreen message="Apenas membros podem ver o ranking e o chat." />;
        // Renderização normal para membros/admins
        return currentPage === 'ranking' ? <RankingScreen users={allUsers} /> : <ChatScreen />;
      default:
        return <FeedScreen deals={businessDeals} onCreatePost={handleNavigateCreatePost} currentUser={currentUser} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>
        {renderPage()}
      </View>
      <BottomNavigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        currentUser={currentUser}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1d2e',
  },
  container: { flex: 1, backgroundColor: '#1a1d2e' },
  blockedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  blockedTitle: { color: '#f0e6d2', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  blockedMessage: { color: '#a1a1aa', textAlign: 'center', marginTop: 16, lineHeight: 20 },
});