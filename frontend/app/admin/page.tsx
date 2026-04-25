'use client';

import { useState, useEffect } from 'react';
import UniversalNavbar from '../components/UniversalNavbar';
import CrearActivoModal from '../components/CrearActivoModal';
import DetalleActivoModal from '../components/DetalleActivoModal';
import { useGlobal } from '../context/GlobalContext';

export default function AdminPage() {
  const { language } = useGlobal(); 
  
  const [activosDB, setActivosDB] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [activoSeleccionado, setActivoSeleccionado] = useState<any | null>(null);

  const t = {
    es: {
      dashTitle: 'Dashboard analítico',
      newReg: '+ Nuevo Registro',
      totEq: 'Total Equipos',
      disp: 'Disponibilidad',
      transito: 'En Tránsito / Prestados',
      atencion: 'Atención / Vencidos',
      invGen: 'Inventario General',
      refresh: '🔄 Refrescar datos',
      colId: 'Identificador',
      colEq: 'Equipo',
      colEst: 'Estado',
      colAcc: 'Acción',
      loading: 'Consultando Base de Datos...',
      empty: 'No hay activos registrados.',
      btnQr: 'Ver QR',
      navRol: 'Administrador'
    },
    en: {
      dashTitle: 'Analytical Dashboard',
      newReg: '+ New Asset',
      totEq: 'Total Assets',
      disp: 'Availability',
      transito: 'In Transit / Loaned',
      atencion: 'Attention / Overdue',
      invGen: 'General Inventory',
      refresh: '🔄 Refresh data',
      colId: 'Identifier',
      colEq: 'Asset',
      colEst: 'Status',
      colAcc: 'Action',
      loading: 'Querying Database...',
      empty: 'No assets registered.',
      btnQr: 'View QR',
      navRol: 'Administrator'
    }
  };
  const currentT = t[language];

  // --- MAPEO DE ESTADOS PARA TRADUCCIÓN ---
  const traducirEstado = (estado: string) => {
    const estadoReal = estado || 'Disponible';
    if (language === 'es') return estadoReal;
    
    const diccionarioEstados: Record<string, string> = {
      'Disponible': 'Available',
      'Solicitado': 'Requested',
      'Aprobado': 'Approved',
      'En Uso': 'In Use',
      'Mantenimiento': 'Maintenance'
    };
    return diccionarioEstados[estadoReal] || estadoReal;
  };

  const fetchActivos = async () => {
    try {
      setCargando(true);
      const res = await fetch('http://127.0.0.1:3001/activos');
      if (res.ok) {
        const data = await res.json();
        setActivosDB(data);
      }
    } catch (error) {
      console.error('Error BD', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchActivos(); }, []);

  const totalActivos = activosDB.length;
  const disponibles = activosDB.filter(a => a.estado === 'Disponible' || !a.estado).length;
  const prestados = activosDB.filter(a => a.estado === 'En Uso' || a.estado === 'Solicitado' || a.estado === 'Aprobado').length;
  const vencidos = activosDB.filter(a => a.estado === 'Mantenimiento').length;
  const dispPorcentaje = totalActivos > 0 ? Math.round((disponibles / totalActivos) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      
      <UniversalNavbar titulo="Dashboard" rol={currentT.navRol} />

      <div className="max-w-6xl mx-auto p-6 mt-4">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#0056A8] dark:text-blue-400 tracking-tight">{currentT.dashTitle}</h2>
          <button onClick={() => setIsModalCreateOpen(true)} className="bg-[#0056A8] hover:bg-[#004385] text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors">
            {currentT.newReg}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{currentT.totEq}</p>
            <p className="text-4xl font-black text-[#0056A8] dark:text-blue-500">{totalActivos}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{currentT.disp}</p>
            <p className="text-4xl font-black text-emerald-600 dark:text-emerald-500">{dispPorcentaje}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{currentT.transito}</p>
            <p className="text-4xl font-black text-slate-700 dark:text-slate-300">{prestados}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-5 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">{currentT.atencion}</p>
            <p className="text-4xl font-black text-red-600 dark:text-red-500">{vencidos}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
            <p className="font-bold text-slate-800 dark:text-slate-200">{currentT.invGen}</p>
            <button onClick={fetchActivos} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold">{currentT.refresh}</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colId}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colEq}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colEst}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">{currentT.colAcc}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {cargando ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">{currentT.loading}</td></tr>
                ) : activosDB.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">{currentT.empty}</td></tr>
                ) : (
                  activosDB.map((activo) => (
                    <tr key={activo.identificador} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-slate-600 dark:text-slate-400">{activo.identificador}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{activo.nombre_maquina}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md uppercase tracking-wide border ${
                          activo.estado === 'Mantenimiento' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/50' :
                          activo.estado === 'En Uso' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50' :
                          activo.estado === 'Aprobado' || activo.estado === 'Solicitado' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50' :
                          'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50'
                        }`}>
                          {/* AQUÍ APLICAMOS LA TRADUCCIÓN */}
                          {traducirEstado(activo.estado)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setActivoSeleccionado(activo)}
                          className="text-[#0056A8] dark:text-blue-400 hover:text-[#003865] dark:hover:text-blue-300 font-semibold px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          {currentT.btnQr}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalCreateOpen && <CrearActivoModal onClose={() => { setIsModalCreateOpen(false); fetchActivos(); }} />}
        {activoSeleccionado && <DetalleActivoModal activo={activoSeleccionado} onClose={() => setActivoSeleccionado(null)} />}
        
      </div>
    </div>
  );
}