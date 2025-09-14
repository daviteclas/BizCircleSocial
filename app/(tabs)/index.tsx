import { AuthProvider } from '@/context/AuthContext';
import MainNavigator from '@/MainNavigator';
import React from 'react';


export default function App() {

  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}