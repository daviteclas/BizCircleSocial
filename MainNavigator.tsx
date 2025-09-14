import { addExperiencePoints, getDeals, getPendingUsers, getUsers, insertDeal, resetDatabase, setupDatabase, updateDatabaseSchema, updateDealStatus, updateUserClasse, updateUserStatus } from '@/components/data/database';
import { AppPage, BusinessDeal, UserProfile } from '@/components/data/types';
import { RankingScreen } from '@/components/RankingScreen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AdminPanelScreen } from './components/AdminPanelScreen';
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
import { UserReportScreen } from './components/UserReportScreen';
import { useAuth } from './context/AuthContext';

// Um componente simples para telas bloqueadas
const BlockedScreen = ({ message }: { message: string }) => (
  <View style={styles.blockedContainer}>
    <Text style={styles.blockedTitle}>Acesso Restrito</Text>
    <Text style={styles.blockedMessage}>{message}</Text>
  </View>
);

export default function MainNavigator() {
  const { currentUser, isLoading, signup } = useAuth(); 
  const [dbInitialized, setDbInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [businessDeals, setBusinessDeals] = useState<BusinessDeal[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [viewingUserReportId, setViewingUserReportId] = useState<string | null>(null);

  const handleViewUserReport = (userId: string) => {
    setViewingUserReportId(userId);
  };
  const handleGoBackFromReport = () => {
    setViewingUserReportId(null);
  };

  if (viewingUserReportId) {
    return (
        <SafeAreaView style={styles.container}>
            <UserReportScreen userId={viewingUserReportId} onGoBack={handleGoBackFromReport} />
        </SafeAreaView>
    );
  }

  // Função para recarregar todos os dados do banco
  const refreshData = async () => {
    const [deals, users, pUsers] = await Promise.all([getDeals(), getUsers(), getPendingUsers()]);
    setBusinessDeals(deals);
    setAllUsers(users);
    setPendingUsers(pUsers);
  };

  const handleSignupSubmit = async (userData: any) => {
    // Chama a função de signup do AuthContext
    const result = await signup(userData);

    // O Alert e a lógica de navegação ficam aqui
    Alert.alert(result.success ? "Sucesso!" : "Erro no Cadastro", result.message);

    if (result.success) {
      await refreshData(); // Recarrega os dados para atualizar a lista de pendentes
      setAuthPage('guest'); // Volta para a tela de perfil do convidado
    }
  };

  const handleUserApproval = async (userId: string, classe: 'membro' | 'infinity' | 'sócio') => {
    await updateUserClasse(userId, classe);
    await updateUserStatus(userId, 'approved');
    await refreshData(); // Recarrega todos os dados
  };

  const handleUserRejection = async (userId: string) => {
    await updateUserStatus(userId, 'rejected'); // Ou você pode deletar o usuário
    await refreshData(); // Recarrega todos os dados
  };

  // Estado para controlar a navegação dentro da aba de perfil do convidado
  const [authPage, setAuthPage] = useState<'guest' | 'login' | 'signup'>('guest');
  
  const handleSelectUser = (userId: string) => {
    if (!currentUser) {
      Alert.alert(
        "Acesso Exclusivo para Membros",
        "Crie uma conta ou faça login para interagir com os membros.",
        [{ text: "OK", onPress: () => setCurrentPage('profile') }]
      );
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
      await refreshData();
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
    return <View style={styles.container}><ActivityIndicator size="large" color="#eab308" /></View>;
  }

  // Se for convidado (ninguém logado)
  if (!currentUser) {
    if (currentPage === 'profile') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" />
                {authPage === 'guest' && <GuestProfileScreen onNavigateToLogin={() => setAuthPage('login')} onNavigateToSignup={() => setAuthPage('signup')} />}
                {authPage === 'login' && <LoginScreen onGoBack={() => setAuthPage('guest')} />}
                {authPage === 'signup' && <SignupScreen onGoBack={() => setAuthPage('guest')} onSubmit={handleSignupSubmit} />}
            </SafeAreaView>
        );
    }
    // Para convidados, as outras abas podem mostrar uma tela bloqueada ou o feed
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <FeedScreen deals={businessDeals} onCreatePost={() => {}} currentUser={currentUser} />
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
        <ProfileScreen 
            userId={viewingUserId} 
            onGoBack={handleGoBack} 
            onViewReport={handleViewUserReport}
        />
      </SafeAreaView>
    );
  }

  // Se estiver no fluxo de login/cadastro, renderiza apenas essa tela
  if (!currentUser && (authPage === 'login' || authPage === 'signup')) {
    return (
      <SafeAreaView style={styles.container}>
        {authPage === 'login' && <LoginScreen onGoBack={() => setAuthPage('guest')} />}
        {/* Passa a função 'handleSignupSubmit' corrigida */}
        {authPage === 'signup' && <SignupScreen onGoBack={() => setAuthPage('guest')} onSubmit={handleSignupSubmit} />}
      </SafeAreaView>
    );
  }

  const renderPage = () => {
    const userRole = currentUser ? currentUser.role : 'guest';
    
    switch (currentPage) {
      case 'createPost':
        return (
          <CreatePostScreen 
            currentUser={currentUser!}
            allUsers={mockUsers}
            onGoBack={() => setCurrentPage('feed')} 
            onSubmit={handleSubmitPost} 
          />
        );
      case 'feed':
        return <FeedScreen deals={businessDeals} onCreatePost={handleNavigateCreatePost} currentUser={currentUser} />;
      
      case 'profile':
        if (userRole === 'guest') {
          return <GuestProfileScreen onNavigateToLogin={() => setAuthPage('login')} onNavigateToSignup={() => setAuthPage('signup')} />;
        }
        // CORREÇÃO: Adicionado o 'return' que estava faltando
        return (
            <ProfileScreen 
                userId={currentUser.id} 
                onGoBack={handleGoBack} 
                onViewReport={handleViewUserReport}
            />
        );
      // --- LÓGICA CORRIGIDA PARA TELAS RESTRITAS ---
      case 'search':
        if (userRole === 'guest') return <BlockedScreen message="Apenas membros podem ver esta área." />;
        return <SearchScreen onSelectUser={handleSelectUser} />;
      
      case 'ranking':
        if (userRole === 'guest') return <BlockedScreen message="Apenas membros podem ver esta área." />;
        return <RankingScreen users={allUsers} />;

      case 'chat':
        if (userRole === 'guest') return <BlockedScreen message="Apenas membros podem ver esta área." />;
        return <ChatScreen />;

      case 'approval':
        if (userRole !== 'admin') return <BlockedScreen message="Esta área é restrita para administradores." />;
        return (
          <AdminPanelScreen
            pendingDeals={businessDeals.filter(d => d.status === 'pending')}
            pendingUsers={pendingUsers}
            onRefresh={refreshData}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
            onApproveUser={handleUserApproval}
            onRejectUser={handleUserRejection}
          />
        );
        
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