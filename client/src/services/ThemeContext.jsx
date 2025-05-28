import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme } from '../assets/template';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Get theme from localStorage or default to 'forge'
    return localStorage.getItem('selectedTheme') || 'forge';
  });

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(currentTheme);
    // Save to localStorage for persistence
    localStorage.setItem('selectedTheme', currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};