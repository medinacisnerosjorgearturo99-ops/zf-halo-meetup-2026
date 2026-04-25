'use client';

import { useState, useEffect } from 'react';
import UniversalNavbar from '../components/UniversalNavbar';
import { useGlobal } from '../context/GlobalContext';

export default function UsuarioPage() {
  const { language } = useGlobal();
  const [activeTab, setActiveTab] = useState('catalogo');
  const [activosDB, setActivosDB] = useState<any[]>([]);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [qrPase, setQrPase] = useState<{ id: string, tipo: 'TOKEN-OUT' | 'TOKEN-IN' } | null>(null);

  // --- DICCIONARIO DE TRADUCCIONES ---
  const t = {
    es: {
      navRol: 'Colaborador',
      tabCat: '📋 Catálogo',
      tabPrest: '🎒 Mis Préstamos',
      btnReq: '+ Solicitar',
      btnWait: '⏳ Esperando autorización...',
      btnOut: '🎟️ Mostrar Pase de Salida',
      btnIn: '🔄 Mostrar Pase de Devolución',
      alertOk: '✅ ¡Solicitud enviada!\nEl Gerente ha sido notificado.',
      alertErr: 'Error al solicitar',
      passOutTitle: 'Pase de Salida',
      passInTitle: 'Pase de Devolución',
      passDesc: 'Muestra este código al Guardia en el Kiosco de Seguridad para validar tu transacción.'
    },
    en: {
      navRol: 'Collaborator',
      tabCat: '📋 Catalog',
      tabPrest: '🎒 My Loans',
      btnReq: '+ Request',
      btnWait: '⏳ Waiting for authorization...',
      btnOut: '🎟️ Show Check-out Pass',
      btnIn: '🔄 Show Check-in Pass',
      alertOk: '✅ Request sent!\nThe Manager has been notified.',
      alertErr: 'Error submitting request',
      passOutTitle: 'Check-out Pass',
      passInTitle: 'Check-in Pass',
      passDesc: 'Show this code to the Security Guard at the Kiosk to validate your transaction.'
    }
  };
  const currentT = t[language];

  // Traductor de Estados
  const traducirEstado = (estado: string) => {
    const est = estado || 'Disponible';
    if (language === 'es') return est;
    const dicc: Record<string, string> = { 'Disponible': 'Available', 'Solicitado': 'Requested', 'Aprobado': 'Approved', 'En Uso': 'In Use', 'Mantenimiento': 'Maintenance' };
    return dicc[est] || est;
  };

  const fetchActivos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activos`);
      setActivosDB(await res.json());
    } catch (error) { console.error('Error BD', error); }
  };

  useEffect(() => { fetchActivos(); }, []);

  const catalogo = activosDB.filter(a => a.estado === 'Disponible' || !a.estado);
  const misPrestamos = activosDB.filter(a => a.estado === 'Solicitado' || a.estado === 'Aprobado' || a.estado === 'En Uso');

  const handleSolicitar = async (id: string) => {
    setProcesando(id);
    try {
      await fetch(`http://127.0.0.1:3001/activos/${id}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Solicitado' })
      });
      fetchActivos(); 
      alert(currentT.alertOk);
    } catch (error) { alert(currentT.alertErr); } 
    finally { setProcesando(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 pb-20">
      <UniversalNavbar titulo="Portal de Activos" rol={currentT.navRol} />

      <div className="max-w-5xl mx-auto p-6 mt-4">
        
        {/* Pestañas de Navegación */}
        <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1.5 rounded-xl mb-8 shadow-inner border border-slate-200 dark:border-slate-800">
          <button onClick={() => {setActiveTab('catalogo'); fetchActivos();}} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'catalogo' ? 'bg-white dark:bg-slate-800 text-[#0056A8] dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {currentT.tabCat}
          </button>
          <button onClick={() => {setActiveTab('prestamos'); fetchActivos();}} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'prestamos' ? 'bg-white dark:bg-slate-800 text-[#0056A8] dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {currentT.tabPrest}
          </button>
        </div>

        {/* VISTA 1: CATÁLOGO */}
        {activeTab === 'catalogo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {catalogo.map((equipo) => (
              <div key={equipo.identificador} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-[11px] text-slate-400 font-mono mb-2 tracking-wider">{equipo.identificador}</p>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-4">{equipo.nombre_maquina}</h3>
                </div>
                <button onClick={() => handleSolicitar(equipo.identificador)} disabled={procesando === equipo.identificador} className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-[#0056A8] hover:text-white text-[#0056A8] dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700 hover:border-transparent">
                  {procesando === equipo.identificador ? '⏳' : currentT.btnReq}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VISTA 2: MIS PRÉSTAMOS */}
        {activeTab === 'prestamos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {misPrestamos.map((prestamo) => (
              <div key={prestamo.identificador} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="mb-6">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide border ${
                    prestamo.estado === 'En Uso' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30' :
                    'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30'
                  }`}>
                    {traducirEstado(prestamo.estado)}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mt-3">{prestamo.nombre_maquina}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">{prestamo.identificador}</p>
                </div>

                {prestamo.estado === 'Solicitado' && <p className="text-sm text-amber-600 dark:text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg text-center">{currentT.btnWait}</p>}
                
                {prestamo.estado === 'Aprobado' && (
                  <button onClick={() => setQrPase({ id: prestamo.identificador, tipo: 'TOKEN-OUT' })} className="w-full py-3 bg-[#0056A8] hover:bg-[#004385] text-white rounded-xl font-bold shadow-sm transition-colors">
                    {currentT.btnOut}
                  </button>
                )}

                {prestamo.estado === 'En Uso' && (
                  <button onClick={() => setQrPase({ id: prestamo.identificador, tipo: 'TOKEN-IN' })} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition-colors mt-2">
                    {currentT.btnIn}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DEL PASE QR */}
      {qrPase && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-6 z-50 animate-fadeIn backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <button onClick={() => setQrPase(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <p className="text-[11px] font-extrabold text-[#0056A8] dark:text-blue-400 uppercase tracking-widest mb-2">
              {qrPase.tipo === 'TOKEN-OUT' ? currentT.passOutTitle : currentT.passInTitle}
            </p>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">{qrPase.id}</h2>
            
            <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-inner border border-slate-200">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrPase.tipo}:${qrPase.id}`} alt="Token QR" className="w-56 h-56" />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-4">
              {currentT.passDesc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}