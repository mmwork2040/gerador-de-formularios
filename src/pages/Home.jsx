import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Layout, FileText, LogOut, Sparkles, ExternalLink, Edit, Trash2, Copy } from 'lucide-react';

export default function Home() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  const loadForms = () => {
    // Load forms from LocalStorage (keys starting with 'form_')
    const loadedForms = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('form_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const token = key.replace('form_', '');
          loadedForms.push({
            token,
            title: data?.design?.titleText || 'Formulário Sem Título',
            fieldsCount: data?.fields?.length || 0,
            date: new Date().toLocaleDateString() // We don't have created_at yet, just mock it
          });
        } catch (e) {
          console.error('Error parsing form data', e);
        }
      }
    }
    setForms(loadedForms);
  };

  useEffect(() => {
    loadForms();
  }, []);

  const createNewForm = () => {
    const newToken = uuidv4();
    navigate(`/builder/${newToken}`);
  };

  const deleteForm = (token) => {
    if (window.confirm('Tem certeza que deseja excluir este formulário? Essa ação não pode ser desfeita.')) {
      localStorage.removeItem(`form_${token}`);
      loadForms();
    }
  };

  const duplicateForm = (token) => {
    try {
      const data = JSON.parse(localStorage.getItem(`form_${token}`));
      if (data) {
        if (data.design && data.design.titleText) {
          data.design.titleText = `${data.design.titleText} (Cópia)`;
        }
        const newToken = uuidv4();
        localStorage.setItem(`form_${newToken}`, JSON.stringify(data));
        loadForms();
      }
    } catch (e) {
      console.error('Error duplicating form', e);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-builder)' }}>
      {/* Sidebar Nav */}
      <aside className="sidebar" style={{ width: 280, padding: '24px 20px', borderRight: '1px solid var(--border-builder)', background: '#fff' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-color)' }} /> FormGen Studio
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="tab-btn active" style={{ background: '#f1f5f9', color: 'var(--text-main)' }}>
            <Layout size={18} /> Meus Formulários
          </button>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="tab-btn" onClick={handleLogout} style={{ color: 'var(--danger-color)' }}>
            <LogOut size={18} /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>Gerencie e crie seus formulários distribuídos.</p>
            </div>
            <button className="btn btn-primary" onClick={createNewForm}>
              <Plus size={18} /> Criar Novo Formulário
            </button>
          </div>

          {forms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px dashed var(--border-builder)' }}>
              <FileText size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Nenhum formulário criado</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Você ainda não criou nenhum formulário. Comece agora!</p>
              <button className="btn btn-primary" onClick={createNewForm}>Criar Meu Primeiro Form</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {forms.map(form => (
                <div key={form.token} style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid var(--border-builder)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{form.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, display: 'flex', gap: 12 }}>
                    <span>{form.fieldsCount} campos</span>
                    <span>•</span>
                    <span>Token: {form.token.substring(0, 8)}...</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" style={{ flex: '1 1 45%', padding: '8px', fontSize: 13 }} onClick={() => navigate(`/builder/${form.token}`)}>
                      <Edit size={14} /> Editar
                    </button>
                    <button className="btn btn-outline" style={{ flex: '1 1 45%', padding: '8px', fontSize: 13 }} onClick={() => window.open(`/f/${form.token}`, '_blank')}>
                      <ExternalLink size={14} /> Ver Ao Vivo
                    </button>
                    <button className="btn btn-outline" style={{ flex: '1 1 45%', padding: '8px', fontSize: 13 }} onClick={() => duplicateForm(form.token)}>
                      <Copy size={14} /> Duplicar
                    </button>
                    <button className="btn btn-outline" style={{ flex: '1 1 45%', padding: '8px', fontSize: 13, color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => deleteForm(form.token)}>
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
