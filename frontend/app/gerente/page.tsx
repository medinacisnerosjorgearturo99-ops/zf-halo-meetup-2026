'use client';

import { useState, useEffect } from 'react';
import UniversalNavbar from '../components/UniversalNavbar';
import { useGlobal } from '../context/GlobalContext';

export default function GerentePage() {
  const { language } = useGlobal();
  const [activosDB, setActivosDB] = useState<any[]>([]);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  // --- DICCIONARIO DE TRADUCCIONES ---
  const t = {
    es: {
      navRol: 'Gerente ADAS',
      titlePend: 'Solicitudes Pendientes',
      refresh: '🔄 Refrescar',
      empty: 'Todo al día',
      emptySub: 'No hay solicitudes nuevas en la Base de Datos.',
      btnReject: 'Rechazar',
      btnApprove: 'Aprobar',
      btnLoading: '⏳ Procesando...',
      titleOut: 'Equipos Actualmente Fuera del Catálogo',
      colId: 'Identificador',
      colEq: 'Equipo',
      colEst: 'Estado Actual',
      emptyOut: 'Ningún equipo en uso actualmente.',
      alertApp: '✅ Solicitud APROBADA.',
      alertRej: '❌ Solicitud RECHAZADA.',
      alertErr: 'Error de conexión con la Base de Datos.',
      loading: 'Consultando BD...'
    },
    en: {
      navRol: 'ADAS Manager',
      titlePend: 'Pending Requests',
      refresh: '🔄 Refresh',
      empty: 'All caught up',
      emptySub: 'No new requests in the Database.',
      btnReject: 'Reject',
      btnApprove: 'Approve',
      btnLoading: '⏳ Processing...',
      titleOut: 'Assets Currently Out of Catalog',
      colId: 'Identifier',
      colEq: 'Asset',
      colEst: 'Current Status',
      emptyOut: 'No assets currently in use.',
      alertApp: '✅ Request APPROVED.',
      alertRej: '❌ Request REJECTED.',
      alertErr: 'Database connection error.',
      loading: 'Querying DB...'
    }
  };
  const currentT = t[language];

  // Mapeo de Estados
  const traducirEstado = (estado: string) => {
    const estadoReal = estado || 'Disponible';
    if (language === 'es') return estadoReal;
    const dicc: Record<string, string> = { 'Disponible': 'Available', 'Solicitado': 'Requested', 'Aprobado': 'Approved', 'En Uso': 'In Use', 'Mantenimiento': 'Maintenance' };
    return dicc[estadoReal] || estadoReal;
  };

  const fetchActivos = async () => {
    try {
      setCargando(true);
      const res = await fetch('http://127.0.0.1:3001/activos');
      if (res.ok) setActivosDB(await res.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchActivos(); }, []);

  const solicitudesPendientes = activosDB.filter(a => a.estado === 'Solicitado');
  const equipoEnUso = activosDB.filter(a => a.estado === 'En Uso' || a.estado === 'Mantenimiento');

  const handleAccion = async (identificador: string, accion: 'aprobar' | 'rechazar') => {
    setProcesando(identificador);
    const nuevoEstado = accion === 'aprobar' ? 'Aprobado' : 'Disponible';
    try {
      const res = await fetch(`http://127.0.0.1:3001/activos/${identificador}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setActivosDB(activosDB.map(a => a.identificador === identificador ? { ...a, estado: nuevoEstado } : a));
      alert(accion === 'aprobar' ? currentT.alertApp : currentT.alertRej);
    } catch (error) {
      alert(currentT.alertErr);
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <UniversalNavbar titulo="Autorizaciones" rol={currentT.navRol} />

      <div className="max-w-6xl mx-auto p-6 space-y-8 mt-4">
        
        {/* SECCIÓN 1: Centro de Aprobaciones */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#0056A8] dark:text-blue-400 flex items-center tracking-tight">
              {currentT.titlePend}
              {solicitudesPendientes.length > 0 && (
                <span className="ml-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{solicitudesPendientes.length}</span>
              )}
            </h2>
            <button onClick={fetchActivos} className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-md font-bold transition-colors">
              {currentT.refresh}
            </button>
          </div>

          {cargando ? (
            <div className="text-center py-10 font-bold text-slate-400 animate-pulse">{currentT.loading}</div>
          ) : solicitudesPendientes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-4xl opacity-80">🎉</span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4">{currentT.empty}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{currentT.emptySub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solicitudesPendientes.map((activo) => (
                <div key={activo.identificador} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800 transition-all">
                  <div className="mb-4">
                    <p className="text-[11px] font-mono font-bold text-slate-400 mb-1">{activo.identificador}</p>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{activo.nombre_maquina}</h3>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button onClick={() => handleAccion(activo.identificador, 'rechazar')} disabled={procesando === activo.identificador} className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm">
                      {currentT.btnReject}
                    </button>
                    <button onClick={() => handleAccion(activo.identificador, 'aprobar')} disabled={procesando === activo.identificador} className="flex-1 px-4 py-2.5 bg-[#0056A8] hover:bg-[#004385] text-white rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50 text-sm">
                      {procesando === activo.identificador ? currentT.btnLoading : currentT.btnApprove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECCIÓN 2: Trazabilidad */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">{currentT.titleOut}</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colId}</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colEq}</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">{currentT.colEst}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {equipoEnUso.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-400">{currentT.emptyOut}</td></tr>
                  ) : (
                    equipoEnUso.map((item) => (
                      <tr key={item.identificador} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-mono font-semibold text-slate-600 dark:text-slate-400">{item.identificador}</td>
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{item.nombre_maquina}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md uppercase tracking-wide border ${
                            item.estado === 'Mantenimiento' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/50' : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50'
                          }`}>
                            {traducirEstado(item.estado)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}