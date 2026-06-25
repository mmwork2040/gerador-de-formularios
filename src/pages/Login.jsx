import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // login, register

  if (!supabase) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-builder)', padding: 24 }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <Sparkles size={48} style={{ color: 'var(--accent-color)', marginBottom: 24 }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Configuração Pendente</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24 }}>
            Para ativar a tela de Login e Autenticação, você precisa criar o arquivo <code>.env</code> na raiz do projeto e configurar as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-builder)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <div style={{ background: '#ffffff', width: '100%', maxWidth: 420, padding: 40, borderRadius: 24, boxShadow: '0 12px 32px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Sparkles size={40} style={{ color: 'var(--accent-color)', marginBottom: 16 }} />
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>FormGen Studio</h1>
            <p style={{ color: 'var(--text-muted)' }}>Crie formulários impressionantes em segundos.</p>
          </div>

          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ width: '100%', marginBottom: 24, padding: '12px', fontSize: 15, background: '#ffffff', color: '#333', borderColor: '#e2e8f0' }}
            onClick={handleGoogleLogin}
          >
            Continuar com Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>ou com e-mail</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 12, borderRadius: 8, fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="input-label">E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#9ca3af' }} />
                <input 
                  type="email" 
                  className="input" 
                  style={{ paddingLeft: 40 }} 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#9ca3af' }} />
                <input 
                  type="password" 
                  className="input" 
                  style={{ paddingLeft: 40 }} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: 8 }} disabled={loading}>
              {loading ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
            <button 
              type="button" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 600, marginLeft: 6, cursor: 'pointer' }}
            >
              {mode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
