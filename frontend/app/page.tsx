'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobal } from './context/GlobalContext';

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme, language, toggleLanguage } = useGlobal();
  
  const [credencial, setCredencial] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Diccionario simple para el cambio de idioma
  const t = {
    es: {
      subtitle: 'Control patrimonial — inicie sesión con su cuenta',
      emailHolder: 'correo@zf.com',
      passHolder: 'Contraseña',
      btn: 'Entrar',
      loading: 'Autenticando...',
      demo: 'Accesos Rápidos (Demo)'
    },
    en: {
      subtitle: 'Asset control — log in to your account',
      emailHolder: 'email@zf.com',
      passHolder: 'Password',
      btn: 'Sign In',
      loading: 'Authenticating...',
      demo: 'Quick Access (Demo)'
    }
  };

  const currentT = t[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credencial, password: password }),
      });

      if (!res.ok) throw new Error('Credenciales inválidas');

      const usuarioDB = await res.json();

      if (usuarioDB.rol_id === 1) router.push('/usuario');
      else if (usuarioDB.rol_id === 2) router.push('/gerente');
      else if (usuarioDB.rol_id === 3) router.push('/admin');
      else if (usuarioDB.rol_id === 4) router.push('/auditor');
      else if (usuarioDB.rol_id === 1002) router.push('/guardia'); 
      else setError('Tu rol no tiene una vista asignada.');

    } catch (err) {
      setError(language === 'es' ? 'Credenciales incorrectas.' : 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillDemo = (email: string) => {
    setCredencial(email);
    setPassword('zf2026');
  };

  return (
    // Fondo general ultra limpio (blanco en claro, azul muy oscuro en dark)
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300 relative">
      
      {/* Controles Globales (Arriba a la derecha) */}
      <div className="absolute top-6 right-6 flex space-x-3">
        <button onClick={toggleLanguage} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          {language === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}
        </button>
        <button onClick={toggleTheme} className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-[400px]">
        
        {/* Cabecera idéntica a la imagen */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Logo Circular ZF */}
          <div className="w-24 h-24 rounded-full border-[5px] border-[#0056A8] dark:border-blue-500 flex items-center justify-center mb-6">
            <span className="text-5xl font-black text-[#0056A8] dark:text-blue-500 tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>ZF</span>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ZF Halo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {currentT.subtitle}
          </p>
        </div>

        {/* Formulario minimalista */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              required
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
              placeholder={currentT.emailHolder}
              className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0056A8] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={currentT.passHolder}
              className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0056A8] focus:border-transparent outline-none transition-all tracking-widest"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium text-center bg-red-50 dark:bg-red-900/30 dark:text-red-400 py-2 rounded-md animate-fadeIn">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0056A8] hover:bg-[#004385] text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70 mt-2"
          >
            {isLoading ? currentT.loading : currentT.btn}
          </button>
        </form>

        {/* Botones de Demo (Discretos) */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-3">
            {currentT.demo}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => autoFillDemo('usuario@zf.com')} className="px-3 py-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded transition-colors">Usuario</button>
            <button onClick={() => autoFillDemo('gerente@zf.com')} className="px-3 py-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded transition-colors">Gerente</button>
            <button onClick={() => autoFillDemo('admin@zf.com')} className="px-3 py-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded transition-colors">Admin</button>
            <button onClick={() => autoFillDemo('auditor@zf.com')} className="px-3 py-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 rounded transition-colors">Auditor</button>
            <button onClick={() => autoFillDemo('guardia@zf.com')} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-500 font-bold hover:bg-amber-100 rounded transition-colors">Kiosco</button>
          </div>
        </div>

      </div>
    </div>
  );
}