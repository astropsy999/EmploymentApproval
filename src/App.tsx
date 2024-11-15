import { CssBaseline, ThemeProvider } from '@mui/material';
import TimeTracker from './components/TimeTracker';
import React from 'react';
import './assets/css/font-awesome.min.css';
import { ColorModeContext, useMode } from './theme';




function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <TimeTracker />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
