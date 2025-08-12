import { useState } from 'react';
import { supabase } from '../../supabaseClient';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    if (!email || !password) return '❗ Vyplň e-mail i heslo.';
    if (!isValidEmail(email)) return '📧 Zadej platný e-mail.';
    if (password.length < 6) return '🔒 Heslo musí mít alespoň 6 znaků.';
    return null;
  };

  const handleAuth = async (e) => {
    e?.preventDefault(); // Handle form submission
    if (isLoading) return;
    setIsLoading(true);

    const validationError = validateFields();
    if (validationError) {
      setMsg(validationError);
      setIsLoading(false);
      return;
    }

    try {
      let data, error;

      if (mode === 'login') {
        ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
      } else {
        ({ data, error } = await supabase.auth.signUp({ email, password }));
      }

      setMsg(
        error
          ? `❌ ${error.message}`
          : mode === 'login'
          ? '✅ Přihlášení úspěšné!'
          : '✅ Registrace úspěšná. Zkontroluj e-mail.'
      );
    } catch (err) {
      setMsg(`⚠️ Neočekávaná chyba: ${err.message || 'Neznámá chyba'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #a2d5c6, #07689f)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h2 style={{ color: '#07689f', textAlign: 'center' }}>
          {mode === 'login' ? 'Přihlášení' : 'Registrace'}
        </h2>

        <form onSubmit={handleAuth}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Zadej e-mail"
            style={{
              padding: '0.75rem',
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '1rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />

          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Heslo
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zadej heslo"
            style={{
              padding: '0.75rem',
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '1rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: mode === 'login' ? '#40a798' : '#07689f',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              width: '100%',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              marginBottom: '0.5rem',
              boxSizing: 'border-box',
            }}
          >
            {isLoading ? 'Probíhá...' : mode === 'login' ? 'Přihlásit se' : 'Registrovat'}
          </button>
        </form>

        <p style={{ color: '#07689f', textAlign: 'center' }}>{msg}</p>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setMsg('');
          }}
          style={{
            backgroundColor: '#eee',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            width: '100%',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {mode === 'login' ? 'Nemáš účet? Registruj se' : 'Už máš účet? Přihlas se'}
        </button>
      </div>
    </div>
  );
}