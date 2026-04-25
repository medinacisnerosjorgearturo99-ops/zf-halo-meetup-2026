import React from 'react';

// Función para traer los datos de tu nuevo backend
async function getKpis() {
  // Asegúrate de que el backend esté corriendo en el puerto 3001
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/estadisticas/kpis`, { 
    cache: 'no-store' // Para que siempre traiga datos frescos
  });
  
  if (!res.ok) {
    throw new Error('Falló la conexión con el backend');
  }
  return res.json();
}

export default async function DashboardPage() {
  const data = await getKpis();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard ZF Halo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta 1: Total de Activos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total de Activos</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{data.kpis.total_activos}</p>
        </div>

        {/* Tarjeta 2: Préstamos Activos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Préstamos en Curso</h2>
          <p className="text-4xl font-bold text-amber-500 mt-2">{data.kpis.prestamos_en_curso}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Inventario</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl">
        <ul className="divide-y divide-gray-200">
          {data.grafica_estados.map((item: any, index: number) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 
                item.estado === 'Prestado' ? 'bg-amber-100 text-amber-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {item.estado}
              </span>
              <span className="text-lg font-semibold text-gray-700">{item.cantidad} equipos</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}