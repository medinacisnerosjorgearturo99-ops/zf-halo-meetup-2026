'use client';

import { useState, useEffect } from 'react';
import UniversalNavbar from '../components/UniversalNavbar';
import { useGlobal } from '../context/GlobalContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AuditorPage() {
  const { language } = useGlobal();
  const [filtro, setFiltro] = useState('');
  const [activosDB, setActivosDB] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const t = {
    es: {
      navRol: 'Auditoría',
      searchHolder: 'Buscar por ID, nombre o estado...',
      btnPdf: '📄 Exportar PDF',
      btnExcel: '📊 Exportar Excel',
      titleGlobal: 'Estado Global de Inventario',
      totReg: 'Total registros:',
      colId: 'Identificador',
      colEq: 'Equipo',
      colMod: 'Modelo',
      colSer: 'No. Serie',
      colEst: 'Estado Actual',
      loading: 'Conectando a la Base de Datos...',
      empty: 'No se encontraron registros.',
      docTitle: 'Reporte de Auditoría Patrimonial - Nebula Company'
    },
    en: {
      navRol: 'Auditing',
      searchHolder: 'Search by ID, name or status...',
      btnPdf: '📄 Export PDF',
      btnExcel: '📊 Export Excel',
      titleGlobal: 'Global Inventory Status',
      totReg: 'Total records:',
      colId: 'Identifier',
      colEq: 'Asset',
      colMod: 'Model',
      colSer: 'Serial No.',
      colEst: 'Current Status',
      loading: 'Connecting to Database...',
      empty: 'No records found.',
      docTitle: 'Asset Audit Report - Nebula Company'
    }
  };
  const currentT = t[language];

  const traducirEstado = (estado: string) => {
    const estadoReal = estado || 'Disponible';
    if (language === 'es') return estadoReal;
    const dicc: Record<string, string> = { 'Disponible': 'Available', 'Solicitado': 'Requested', 'Aprobado': 'Approved', 'En Uso': 'In Use', 'Mantenimiento': 'Maintenance' };
    return dicc[estadoReal] || estadoReal;
  };

  useEffect(() => {
    const fetchActivos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activos`);
        setActivosDB(await res.json());
      } catch (error) { console.error(error); } finally { setCargando(false); }
    };
    fetchActivos();
  }, []);

  const historialFiltrado = activosDB.filter(item => 
    item.identificador.toLowerCase().includes(filtro.toLowerCase()) || 
    item.nombre_maquina.toLowerCase().includes(filtro.toLowerCase()) ||
    traducirEstado(item.estado).toLowerCase().includes(filtro.toLowerCase())
  );

  const exportarExcel = () => {
    const datosExcel = historialFiltrado.map(a => ({
      [currentT.colId]: a.identificador,
      [currentT.colEq]: a.nombre_maquina,
      [currentT.colMod]: a.modelo || 'N/A',
      [currentT.colSer]: a.numero_serie || 'N/A',
      [currentT.colEst]: traducirEstado(a.estado)
    }));
    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Inventario");
    XLSX.writeFile(libro, "Auditoria_Nebula.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text(currentT.docTitle, 14, 15);
    
    const tablaData = historialFiltrado.map(a => [
      a.identificador, 
      a.nombre_maquina, 
      a.modelo || '-', 
      traducirEstado(a.estado)
    ]);

    // Usamos autoTable como función independiente y le pasamos el 'doc'
    autoTable(doc, {
      startY: 25,
      head: [[currentT.colId, currentT.colEq, currentT.colMod, currentT.colEst]],
      body: tablaData,
      theme: 'grid',
      headStyles: { fillColor: [0, 86, 168] } // Azul ZF corporativo
    });

    doc.save("Auditoria_Nebula.pdf");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <UniversalNavbar titulo="Reportes" rol={currentT.navRol} />

      <div className="max-w-7xl mx-auto p-6 space-y-6 mt-4">
        
        {/* Panel de Búsqueda y Exportación */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <input 
              type="text" 
              placeholder={currentT.searchHolder}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full md:w-1/2 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0056A8] focus:border-transparent outline-none transition-all text-sm"
            />
            <div className="flex space-x-3 w-full md:w-auto">
              <button onClick={exportarPDF} className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
                {currentT.btnPdf}
              </button>
              <button onClick={exportarExcel} className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
                {currentT.btnExcel}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
            <h2 className="font-bold text-slate-800 dark:text-slate-200">{currentT.titleGlobal}</h2>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">{currentT.totReg} {historialFiltrado.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colId}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colEq}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colMod}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colSer}</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{currentT.colEst}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {cargando ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">{currentT.loading}</td></tr>
                ) : historialFiltrado.length > 0 ? (
                  historialFiltrado.map((a) => (
                    <tr key={a.identificador} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-slate-600 dark:text-slate-400">{a.identificador}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{a.nombre_maquina}</td>
                      <td className="p-4 text-slate-500">{a.modelo || 'N/A'}</td>
                      <td className="p-4 text-slate-500">{a.numero_serie || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md uppercase tracking-wide border ${
                          a.estado === 'Mantenimiento' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/50' :
                          a.estado === 'En Uso' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50' :
                          a.estado === 'Aprobado' || a.estado === 'Solicitado' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50' :
                          'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50'
                        }`}>
                          {traducirEstado(a.estado)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">{currentT.empty}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}