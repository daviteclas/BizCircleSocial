import { getDeals, insertDeal, setupDatabase, updateDealStatus } from '@/components/data/database'; // Importe as funções do BD
import { AppPage, BusinessDeal } from '@/components/data/types';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { ApprovalScreen } from '../../components/ApprovalScreen';
import { BottomNavigation } from '../../components/BottomNavigation';
import { ChatScreen } from '../../components/ChatScreen';
import { CreatePostScreen } from '../../components/CreatePostScreen';
import { CURRENT_USER_ID, mockBusinessDeals as initialDeals, mockUsers } from '../../components/data/mockData';
import { FeedScreen } from '../../components/FeedScreen';
import { ProfileScreen } from '../../components/ProfileScreen';
import { SearchScreen } from '../../components/SearchScreen';



export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  const [currentPage, setCurrentPage] = useState<AppPage>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const currentUser = mockUsers.find(u => u.id === CURRENT_USER_ID);

  const [businessDeals, setBusinessDeals] = useState<BusinessDeal[]>(initialDeals);
  
  const handleSelectUser = (userId: string) => setViewingUserId(userId);
  const handleGoBack = () => setViewingUserId(null);
  const handleNavigateCreatePost = () => setCurrentPage('createPost');

  useEffect(() => {
    async function initialize() {
      await setupDatabase();
      const dealsFromDb = await getDeals();
      setBusinessDeals(dealsFromDb);
      setDbInitialized(true);
    }
    initialize();
  }, []);

  // Lógica para aprovar um post
  const handleApprovePost = async (postId: string) => {
    await updateDealStatus(postId, 'approved');
    const updatedDeals = await getDeals(); // Recarrega os dados do BD
    setBusinessDeals(updatedDeals);
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
      default:
        return <FeedScreen onCreatePost={handleNavigateCreatePost} deals={[]} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={{flex: 1}}>
        {renderPage()}
      </View>
      {/* Esconde a barra de navegação ao criar um post */}
      {currentPage !== 'createPost' && (
        <BottomNavigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          currentUser={currentUser} // Passa o usuário atual
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