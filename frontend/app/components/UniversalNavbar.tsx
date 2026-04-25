'use client';

import { useGlobal } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';

export default function UniversalNavbar({ titulo, rol }: { titulo: string, rol?: string }) {
  const { theme, toggleTheme, language, toggleLanguage } = useGlobal();
  const router = useRouter();

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40 transition-colors">
      
      {/* Sección Izquierda: Logo y Título */}
      <div className="flex items-center space-x-4">
        {/* Logo Circular */}
        <div className="w-10 h-10 rounded-full border-[2px] border-[#0056A8] dark:border-blue-500 flex items-center justify-center">
          <span className="text-lg font-black text-[#0056A8] dark:text-blue-500 tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>ZF</span>
        </div>
        
        {/* Separador vertical estilo corporativo */}
        <div className="hidden sm:block border-l border-slate-300 dark:border-slate-700 h-6"></div>
        
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">
          {titulo}
        </h1>
      </div>

      {/* Sección Derecha: Controles y Salida */}
      <div className="flex items-center space-x-3">
        {rol && (
          <span className="hidden md:inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
            {rol}
          </span>
        )}
        
        <div className="flex space-x-2 mr-2">
          <button onClick={toggleLanguage} className="px-2 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {language === 'es' ? 'MX ES' : 'US EN'}
          </button>
          <button onClick={toggleTheme} className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Botón de Salida con ícono SVG estilo dashboard */}
        <button onClick={() => router.push('/')} className="text-slate-500 hover:text-[#0056A8] dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
}