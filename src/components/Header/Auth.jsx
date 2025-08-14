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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a2d5c6] to-[#07689f] font-sans">
  <div className="w-[400px] h-[350px] p-8 rounded-[10px] shadow-lg bg-[#f5f5dc] flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#07689f]">Přihlášení</h2>
          <form onSubmit={handleAuth} className="w-full flex flex-col gap-4">
            <div className="flex flex-col items-center w-full">
              <label htmlFor="email" className="font-semibold text-[#07689f] mb-[4px] text-left w-[300px]">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Zadej e-mail"
                className="w-[300px] h-[30px] px-4 rounded-[4px] border border-gray-200 bg-[#f5f5dc] focus:outline-none text-base mx-auto block mb-[10px]"
              />
            </div>
            <div className="flex flex-col items-center w-full">
              <label htmlFor="password" className="font-semibold text-[#07689f] mb-[4px] text-left w-[300px]">Heslo</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zadej heslo"
                className="w-[300px] h-[30px] px-4 rounded-[4px] border border-gray-200 bg-[#f5f5dc] focus:outline-none text-base mx-auto block mb-[10px]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-[300px] h-[30px] rounded-[4px] text-base font-bold transition-colors duration-200 ${mode === 'login' ? 'bg-[#40a798] hover:bg-[#359184] text-white' : 'bg-[#07689f] hover:bg-[#43c6ac] text-white'} shadow ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} border-0 mx-auto block mb-[10px]`}
            >
              {isLoading ? 'Probíhá...' : mode === 'login' ? 'Přihlásit se' : 'Registrovat'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setMsg('');
              }}
              className="w-[300px] h-[30px] rounded-[4px] bg-[#eee] text-[#07689f] font-semibold text-base hover:bg-[#a2d5c6] transition-colors border-0 mx-auto block mb-[10px] mt-[5px]"
            >
              {mode === 'login' ? 'Nemáš účet? Registruj se' : 'Už máš účet? Přihlas se'}
            </button>
          </form>
          <p className="text-[#07689f] text-center min-h-[24px]">{msg}</p>
        </div>
      </div>

  );
}
