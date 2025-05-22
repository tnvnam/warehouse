import React from 'react';
import AppNavigator from './admin/AppNavigator';
import { ThemeProvider } from './ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;