'use client';

import { useState } from 'react';
import CrearActivoModal from './CrearActivoModal';

export function ActivosClient({ activos }: { activos: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Catálogo de Activos</h1>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + Crear Activo
        </button>

        {isOpen && <CrearActivoModal onClose={() => setIsOpen(false)} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activos.map((activo: any) => (
          <div key={activo.identificador} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{activo.nombre_maquina}</h2>
                <p className="text-sm text-gray-500 font-mono mt-1">{activo.identificador}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                activo.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-700' :
                activo.estado === 'PRESTADO' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {activo.estado}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-6 flex-grow">{activo.descripcion}</p>

            <div className="mt-auto">
              <button
                disabled={activo.estado !== 'DISPONIBLE'}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  activo.estado === 'DISPONIBLE'
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {activo.estado === 'DISPONIBLE' ? 'Solicitar Préstamo' : 'No Disponible'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}