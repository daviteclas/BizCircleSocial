import { addExperiencePoints, getDeals, getUsers, insertDeal, setupDatabase, updateDealStatus } from '@/components/data/database';
import { AppPage, BusinessDeal, UserProfile } from '@/components/data/types';
import { RankingScreen } from '@/components/RankingScreen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { ApprovalScreen } from './components/ApprovalScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { ChatScreen } from './components/ChatScreen';
import { CreatePostScreen } from './components/CreatePostScreen';
import { CURRENT_USER_ID, mockBusinessDeals as initialDeals, mockUsers } from './components/data/mockData';
import { FeedScreen } from './components/FeedScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SearchScreen } from './components/SearchScreen';



export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  const [currentPage, setCurrentPage] = useState<AppPage>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const currentUser = mockUsers.find(u => u.id === CURRENT_USER_ID);

  const [businessDeals, setBusinessDeals] = useState<BusinessDeal[]>(initialDeals);
  
  const handleSelectUser = (userId: string) => setViewingUserId(userId);
  const handleGoBack = () => setViewingUserId(null);
  const handleNavigateCreatePost = () => setCurrentPage('createPost');

  useEffect(() => {
    async function initialize() {
      // await resetDatabase(); 
      await setupDatabase();
      const [dealsFromDb, usersFromDb] = await Promise.all([getDeals(), getUsers()]);
      setBusinessDeals(dealsFromDb);
      setAllUsers(usersFromDb);
      setDbInitialized(true);
    }
    initialize();
  }, []);

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

  if (!dbInitialized) {
    return <View style={styles.safeArea}><ActivityIndicator size="large" color="#eab308"/></View>; // Tela de loading
  }

  // Se for convidado (ninguém logado), mostre a tela de login/cadastro
  if (!currentUser) {
    // Por enquanto, vamos usar a GuestProfileScreen. Depois criaremos Login e Cadastro.
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <GuestProfileScreen /> 
        </SafeAreaView>
    );
  }
  
  if (viewingUserId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <ProfileScreen userId={viewingUserId} onGoBack={handleGoBack} />
      </SafeAreaView>
    );
  }

  const renderPage = () => {
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
        return (
          <ApprovalScreen
            deals={businessDeals}
            onApprove={handleApprovePost}
            onReject={handleRejectPost}
          />
        );
      case 'feed':
        return <FeedScreen deals={businessDeals} onCreatePost={handleNavigateCreatePost} />;
      case 'search':
        return <SearchScreen onSelectUser={handleSelectUser} />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen userId="current-user" onGoBack={() => {}} />;
      case 'ranking':
        return <RankingScreen users={allUsers} />; // Passa a lista de usuários para a tela de ranking
      default:
        return <FeedScreen onCreatePost={handleNavigateCreatePost} deals={[]} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>{renderPage()}</View>
      {currentPage !== 'createPost' && (
        <BottomNavigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          currentUser={currentUser}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1d2e',
  },
});