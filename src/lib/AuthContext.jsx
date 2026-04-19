import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simple auth context - always authenticated for local game
  const value = {
    user: { name: 'Player' },
    isAuthenticated: true,
    isLoadingAuth: false,
    authChecked: true,
    authError: null,
    checkUserAuth: () => {},
    logout: () => {}
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};