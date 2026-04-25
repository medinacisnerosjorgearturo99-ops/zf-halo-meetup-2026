'use client';

import { useState } from 'react';
import UniversalNavbar from '../components/UniversalNavbar';
import { useGlobal } from '../context/GlobalContext';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function KioscoPage() {
  const { language } = useGlobal();
  const [modoEscaneo, setModoEscaneo] = useState<'checkout' | 'checkin' | 'info' | null>(null);
  const [procesando, setProcesando] = useState(false);

  const t = {
    es: {
      navRol: 'Kiosco Seguridad',
      title: 'Validación Patrimonial',
      btnOut: '📤 Validar Salida',
      btnIn: '📥 Validar Regreso',
      btnInfo: '📄 Leer Etiqueta Física',
      scanTitle: 'ESCANEA EL QR',
      validating: 'Validando... ⏳',
      btnCancel: 'Cancelar',
      alertOkOut: '✅ CHECK-OUT EXITOSO\n\nPase de salida validado.',
      alertOkIn: '✅ CHECK-IN EXITOSO\n\nEquipo devuelto.',
      alertDeny: '⛔ ACCESO DENEGADO\n\nEl equipo no está aprobado.',
      alertWarn: '⚠️ AVISO\n\nEl equipo no figura como prestado.',
      alertErrFormat: '🚫 CÓDIGO INVÁLIDO\n\nUsa el pase correcto.',
      alertNoExist: '❌ ERROR: No existe el activo.'
    },
    en: {
      navRol: 'Security Kiosk',
      title: 'Asset Validation',
      btnOut: '📤 Validate Check-out',
      btnIn: '📥 Validate Check-in',
      btnInfo: '📄 Read Physical Tag',
      scanTitle: 'SCAN THE QR',
      validating: 'Validating... ⏳',
      btnCancel: 'Cancel',
      alertOkOut: '✅ CHECK-OUT SUCCESSFUL\n\nExit pass validated.',
      alertOkIn: '✅ CHECK-IN SUCCESSFUL\n\nAsset returned.',
      alertDeny: '⛔ ACCESS DENIED\n\nThe asset is not approved.',
      alertWarn: '⚠️ WARNING\n\nThe asset is not marked as loaned.',
      alertErrFormat: '🚫 INVALID CODE\n\nPlease use the correct pass.',
      alertNoExist: '❌ ERROR: Asset does not exist.'
    }
  };
  const currentT = t[language];

  const abrirEscaner = (modo: 'checkout' | 'checkin' | 'info') => {
    setModoEscaneo(modo);
    setProcesando(false);
  };

  const handleScan = async (detectedCodes: any[]) => {
    if (detectedCodes.length > 0 && !procesando) {
      setProcesando(true);
      const textoEscaneado = detectedCodes[0].rawValue; 

      try {
        const partes = textoEscaneado.split(':'); 
        const prefijo = partes[0]; 
        const identificador = partes[1] || textoEscaneado; 

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activos`);
        const activos = await res.json();
        const encontrado = activos.find((a: any) => a.identificador === identificador);

        if (!encontrado) {
          alert(`${currentT.alertNoExist}\n"${identificador}"`);
          setModoEscaneo(null); setProcesando(false); return;
        }

        if (prefijo === 'INFO') {
          alert(`📄 FICHA TÉCNICA\n\nTag: ${encontrado.identificador}\nEquipo: ${encontrado.nombre_maquina}\nModelo: ${encontrado.modelo || 'N/A'}\nNo. Serie: ${encontrado.numero_serie || 'N/A'}\nEstado: ${encontrado.estado || 'Disponible'}`);
        } else if (modoEscaneo === 'checkout' && prefijo === 'TOKEN-OUT') {
          if (encontrado.estado === 'Aprobado') {
            await fetch(`http://127.0.0.1:3001/activos/${identificador}/estado`, {
              method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'En Uso' })
            });
            alert(currentT.alertOkOut);
          } else { alert(currentT.alertDeny); }
        } else if (modoEscaneo === 'checkin' && prefijo === 'TOKEN-IN') {
          if (encontrado.estado === 'En Uso') {
            await fetch(`http://127.0.0.1:3001/activos/${identificador}/estado`, {
              method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Disponible' })
            });
            alert(currentT.alertOkIn);
          } else { alert(currentT.alertWarn); }
        } else {
          alert(currentT.alertErrFormat);
        }
      } catch (error) {
        alert('Error DB Connection');
      } finally {
        setModoEscaneo(null);
        setProcesando(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      <UniversalNavbar titulo="Kiosco" rol={currentT.navRol} />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {!modoEscaneo && (
          <div className="w-full max-w-md animate-fadeIn space-y-4">
            <div className="text-center mb-10">
              <span className="text-5xl block mb-4">🛡️</span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{currentT.title}</h2>
            </div>

            <button onClick={() => abrirEscaner('checkout')} className="w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 hover:border-[#0056A8] dark:hover:border-blue-500 text-slate-800 dark:text-white p-6 rounded-2xl flex items-center justify-between group shadow-sm transition-all hover:shadow-md">
              <div className="text-left"><h3 className="text-lg font-extrabold text-[#0056A8] dark:text-blue-400">{currentT.btnOut}</h3></div><span className="text-3xl opacity-80 group-hover:scale-110 transition-transform">📤</span>
            </button>
            
            <button onClick={() => abrirEscaner('checkin')} className="w-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-600 dark:hover:border-emerald-500 text-slate-800 dark:text-white p-6 rounded-2xl flex items-center justify-between group shadow-sm transition-all hover:shadow-md">
              <div className="text-left"><h3 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-500">{currentT.btnIn}</h3></div><span className="text-3xl opacity-80 group-hover:scale-110 transition-transform">📥</span>
            </button>
            
            <button onClick={() => abrirEscaner('info')} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white p-6 rounded-2xl flex items-center justify-between shadow-sm transition-all">
              <div className="text-left"><h3 className="text-lg font-extrabold text-slate-600 dark:text-slate-300">{currentT.btnInfo}</h3></div><span className="text-3xl opacity-80">🔍</span>
            </button>
          </div>
        )}

        {modoEscaneo && (
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-fadeIn">
            <div className={`p-4 text-center font-extrabold text-white tracking-widest uppercase ${modoEscaneo === 'info' ? 'bg-slate-600' : modoEscaneo === 'checkout' ? 'bg-[#0056A8]' : 'bg-emerald-600'}`}>
              {currentT.scanTitle}
            </div>
            <div className="relative aspect-square bg-slate-900 flex items-center justify-center">
              {procesando ? <div className="text-white animate-pulse font-bold">{currentT.validating}</div> : <Scanner onScan={handleScan} formats={['qr_code']} components={{ zoom: false, finder: true }} />}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900">
              <button onClick={() => setModoEscaneo(null)} className="w-full py-3.5 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-900/30 transition-colors">
                {currentT.btnCancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}