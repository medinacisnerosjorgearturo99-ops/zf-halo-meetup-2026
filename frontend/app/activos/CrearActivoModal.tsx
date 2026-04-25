'use client';

import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext'; // Ajustamos la ruta al contexto

export default function CrearActivoModal({ onClose }: { onClose: () => void }) {
  const { language } = useGlobal();
  const [procesando, setProcesando] = useState(false);

  // Estados para catálogos dinámicos
  const [categoriasDB, setCategoriasDB] = useState<any[]>([]);
  const [ubicacionesDB, setUbicacionesDB] = useState<any[]>([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    identificador: '',
    nombre_maquina: '',
    modelo: '',
    numero_serie: '',
    estado: 'Disponible',
    categoria_id: '',
    ubicacion_id: ''
  });

  // --- DICCIONARIO DE TRADUCCIONES ---
  const t = {
    es: {
      title: 'Alta de Nuevo Activo',
      lblId: 'Identificador (Tag / QR) *',
      lblNom: 'Nombre del Equipo *',
      lblMod: 'Modelo',
      lblSer: 'Número de Serie',
      lblCat: 'Categoría *',
      lblUbi: 'Ubicación *',
      sel: '-- Seleccionar --',
      btnCancel: 'Cancelar',
      btnSave: 'Guardar Registro',
      alertOk: '✅ Activo creado con éxito.',
      alertErr: '❌ Error al crear. Revisa los datos.'
    },
    en: {
      title: 'New Asset Registration',
      lblId: 'Identifier (Tag / QR) *',
      lblNom: 'Asset Name *',
      lblMod: 'Model',
      lblSer: 'Serial Number',
      lblCat: 'Category *',
      lblUbi: 'Location *',
      sel: '-- Select --',
      btnCancel: 'Cancel',
      btnSave: 'Save Record',
      alertOk: '✅ Asset created successfully.',
      alertErr: '❌ Error creating asset.'
    }
  };
  const currentT = t[language];

  // Carga de catálogos desde el Back
  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const [resCat, resUbi] = await Promise.all([
          fetch('http://127.0.0.1:3001/categorias'),
          fetch('http://127.0.0.1:3001/ubicaciones')
        ]);
        if (resCat.ok) setCategoriasDB(await resCat.json());
        if (resUbi.ok) setUbicacionesDB(await resUbi.json());
      } catch (error) { console.error("Error catálogos:", error); }
    };
    fetchSelects();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    const payload = {
      ...formData,
      qr_code_hash: `HASH-${formData.identificador}`,
      categoria: { connect: { id: Number(formData.categoria_id) } },
      ubicacion: { connect: { id: Number(formData.ubicacion_id) } }
    };

    try {
      const res = await fetch('http://127.0.0.1:3001/activos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      alert(currentT.alertOk);
      onClose();
    } catch (error) {
      alert(currentT.alertErr);
    } finally {
      setProcesando(false);
    }
  };

  const inputClass = "w-full bg-white text-slate-900 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0056A8]";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-[#0056A8] dark:text-blue-400 mb-6">{currentT.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">{currentT.lblId}</label>
              <input type="text" name="identificador" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">{currentT.lblNom}</label>
              <input type="text" name="nombre_maquina" required onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{currentT.lblCat}</label>
              <select name="categoria_id" required onChange={handleChange} className={inputClass}>
                <option value="">{currentT.sel}</option>
                {categoriasDB.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{currentT.lblUbi}</label>
              <select name="ubicacion_id" required onChange={handleChange} className={inputClass}>
                <option value="">{currentT.sel}</option>
                {ubicacionesDB.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 font-bold border border-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">{currentT.btnCancel}</button>
            <button type="submit" disabled={procesando} className="flex-1 py-2 bg-[#0056A8] text-white font-bold rounded-lg hover:bg-[#004385] disabled:opacity-50">
              {procesando ? '...' : currentT.btnSave}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}