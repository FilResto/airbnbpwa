import React, { useState, useEffect } from 'react';
import Login from './Login';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    setupAuthListener();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      const sessionResult = await supabaseService.getSession();
      const userResult = await supabaseService.getCurrentUser();
      
      if (sessionResult.success && userResult.success && userResult.data) {
        setIsAuthenticated(true);
        setUser(userResult.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Errore nel controllo autenticazione:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const setupAuthListener = async () => {
    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      // Ascolta i cambiamenti di stato dell'autenticazione
      const { data: { subscription } } = supabaseService.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            setIsAuthenticated(true);
            setUser(session.user);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      );

      // Cleanup della subscription quando il componente viene smontato
      return () => subscription?.unsubscribe();
    } catch (error) {
      console.error('Errore nel setup auth listener:', error);
    }
  };

  const handleLogin = (success) => {
    if (success) {
      checkAuthStatus();
    }
  };

  const handleLogout = async () => {
    try {
      const { default: SupabaseServiceModule } = await import('../services/supabaseService');
      const supabaseService = new SupabaseServiceModule();
      
      const result = await supabaseService.signOut();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.error('Errore logout:', result.error);
      }
    } catch (error) {
      console.error('Errore logout:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Caricamento...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Aggiungi pulsante logout ai componenti protetti
  const childrenWithLogout = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onLogout: handleLogout, user });
    }
    return child;
  });

  return childrenWithLogout;
}

export default ProtectedRoute; 