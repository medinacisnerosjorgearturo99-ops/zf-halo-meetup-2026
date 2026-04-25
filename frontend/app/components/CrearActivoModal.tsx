'use client';

import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function CrearActivoModal({ onClose }: { onClose: () => void }) {
  const { language } = useGlobal();
  const [procesando, setProcesando] = useState(false);

  // Estados para guardar las listas de la base de datos
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
      subtitle: 'Ingrese los datos técnicos del equipo para agregarlo al catálogo.',
      lblId: 'Identificador (Tag / QR)',
      plcId: 'Ej: LPT-007',
      lblNom: 'Nombre del Equipo',
      plcNom: 'Ej: Laptop Dell XPS',
      lblMod: 'Modelo',
      plcMod: 'Ej: XPS 15',
      lblSer: 'Número de Serie',
      plcSer: 'Ej: SN-98765',
      lblCat: 'Categoría',
      selCat: '-- Seleccionar Categoría --',
      lblUbi: 'Ubicación',
      selUbi: '-- Seleccionar Ubicación --',
      btnCancel: 'Cancelar',
      btnSave: 'Guardar Registro',
      btnSaving: 'Guardando...',
      alertOk: '✅ Activo creado exitosamente.',
      alertErr: '❌ Error al crear el activo. Verifica los datos o la conexión.'
    },
    en: {
      title: 'New Asset Registration',
      subtitle: 'Enter the technical details of the equipment to add it to the catalog.',
      lblId: 'Identifier (Tag / QR)',
      plcId: 'Ex: LPT-007',
      lblNom: 'Asset Name',
      plcNom: 'Ex: Dell XPS Laptop',
      lblMod: 'Model',
      plcMod: 'Ex: XPS 15',
      lblSer: 'Serial Number',
      plcSer: 'Ex: SN-98765',
      lblCat: 'Category',
      selCat: '-- Select Category --',
      lblUbi: 'Location',
      selUbi: '-- Select Location --',
      btnCancel: 'Cancel',
      btnSave: 'Save Record',
      btnSaving: 'Saving...',
      alertOk: '✅ Asset created successfully.',
      alertErr: '❌ Error creating asset. Check the data or connection.'
    }
  };
  const currentT = t[language];

  // 1. Cargar las categorías y ubicaciones reales al abrir el modal
  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
        const resUbi = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ubicaciones`);
        
        if (resCat.ok) setCategoriasDB(await resCat.json());
        if (resUbi.ok) setUbicacionesDB(await resUbi.json());
      } catch (error) {
        console.error("Error cargando los catálogos:", error);
      }
    };
    fetchSelects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    // 2. Armamos el paquete exacto que Prisma necesita, usando "connect" para las relaciones
    const payloadParaBD: any = {
      identificador: formData.identificador,
      nombre_maquina: formData.nombre_maquina,
      modelo: formData.modelo,
      numero_serie: formData.numero_serie,
      estado: formData.estado,
      qr_code_hash: `HASH-${formData.identificador}`,
    };

    // Solo enviamos las relaciones si el usuario seleccionó una opción
    if (formData.categoria_id) {
      payloadParaBD.categoria = { connect: { id: Number(formData.categoria_id) } };
    }
    if (formData.ubicacion_id) {
      payloadParaBD.ubicacion = { connect: { id: Number(formData.ubicacion_id) } };
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadParaBD)
      });

      if (!res.ok) {
        const errorDB = await res.json();
        console.log("Error de la BD:", errorDB);
        throw new Error('Error al guardar');
      }

      alert(currentT.alertOk);
      onClose(); 
    } catch (error) {
      alert(currentT.alertErr);
    } finally {
      setProcesando(false);
    }
  };

  // Clases estandarizadas
  const inputClass = "w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-[#0056A8] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-[#0056A8]/50 text-sm";

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center relative">
          <div>
            <h2 className="text-xl font-black text-[#0056A8] dark:text-blue-400 tracking-tight">{currentT.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentT.subtitle}</p>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* PRIMERA SECCIÓN: DATOS BÁSICOS (Como lo pediste) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{currentT.lblId} *</label>
              <input type="text" name="identificador" required value={formData.identificador} onChange={handleChange} placeholder={currentT.plcId} className={`${inputClass} font-mono uppercase`} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{currentT.lblNom} *</label>
              <input type="text" name="nombre_maquina" required value={formData.nombre_maquina} onChange={handleChange} placeholder={currentT.plcNom} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{currentT.lblMod}</label>
              <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder={currentT.plcMod} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{currentT.lblSer}</label>
              <input type="text" name="numero_serie" value={formData.numero_serie} onChange={handleChange} placeholder={currentT.plcSer} className={`${inputClass} font-mono`} />
            </div>
          </div>

          {/* SEGUNDA SECCIÓN: CLASIFICACIÓN (Catálogos de la BD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{currentT.lblCat} *</label>
              <select name="categoria_id" required value={formData.categoria_id} onChange={handleChange} className={inputClass}>
                <option value="">{currentT.selCat}</option>
                {categoriasDB.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{currentT.lblUbi} *</label>
              <select name="ubicacion_id" required value={formData.ubicacion_id} onChange={handleChange} className={inputClass}>
                <option value="">{currentT.selUbi}</option>
                {ubicacionesDB.map((ubi: any) => (
                  <option key={ubi.id} value={ubi.id}>{ubi.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              {currentT.btnCancel}
            </button>
            <button type="submit" disabled={procesando} className="flex-1 px-4 py-2.5 bg-[#0056A8] hover:bg-[#004385] text-white rounded-xl font-bold shadow-sm transition-colors disabled:opacity-70">
              {procesando ? currentT.btnSaving : currentT.btnSave}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}