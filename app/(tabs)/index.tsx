import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { FeedScreen } from '../../components/FeedScreen';
import { SearchScreen } from '../../components/SearchScreen';
import { ChatScreen } from '../../components/ChatScreen';
import { ProfileScreen } from '../../components/ProfileScreen';
import { BottomNavigation, AppPage } from '../../components/BottomNavigation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setViewingUserId(userId);
  };

  const handleGoBack = () => {
    setViewingUserId(null);
  };

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
      case 'feed':
        return <FeedScreen />;
      case 'search':
        return <SearchScreen onSelectUser={handleSelectUser} />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen userId="current-user" onGoBack={() => {}} />;
      default:
        return <FeedScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {renderPage()}
      <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1d2e',
  },
});