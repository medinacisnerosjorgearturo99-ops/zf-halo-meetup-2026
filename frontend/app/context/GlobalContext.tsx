'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'es' | 'en';

interface GlobalContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  // Al cargar la página, leemos la memoria del navegador
  useEffect(() => {
    const savedTheme = localStorage.getItem('zf_theme') as Theme;
    const savedLanguage = localStorage.getItem('zf_language') as Language;
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    setMounted(true);
  }, []);

  // Cada vez que cambia el tema, actualizamos el HTML y la memoria
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zf_theme', theme);
  }, [theme, mounted]);

  // Cada vez que cambia el idioma, guardamos en memoria
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('zf_language', language);
  }, [language, mounted]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));

  // Evitamos renderizar hasta que sepamos qué tema cargar para evitar "parpadeos"
  if (!mounted) return <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950"></div>;

  return (
    <GlobalContext.Provider value={{ theme, toggleTheme, language, toggleLanguage }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal debe usarse dentro de un GlobalProvider');
  return context;
};