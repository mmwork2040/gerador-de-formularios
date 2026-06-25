import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Builder from './pages/Builder';
import PublicForm from './pages/PublicForm';
import Home from './pages/Home';
import Login from './pages/Login';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If supabase is not configured, we mock the session to allow local usage
    if (!supabase) {
      setSession({ user: { id: 'local-user', email: 'local@demo.com' } });
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={session ? <Home /> : <Navigate to="/login" />} />
      <Route path="/builder/:token" element={session ? <Builder /> : <Navigate to="/login" />} />
      <Route path="/f/:token" element={<PublicForm />} />
    </Routes>
  );
}

export default App;
