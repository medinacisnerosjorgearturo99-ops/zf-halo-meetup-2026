'use client';

export default function DetalleActivoModal({ activo, onClose }: { activo: any, onClose: () => void }) {
  const descargarQR = async () => {
    try {
      // AQUÍ ESTÁ LA MAGIA: Le agregamos "INFO:" antes del identificador
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=INFO:${activo.identificador}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_Fisico_${activo.identificador}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error al descargar el QR.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white">✖</button>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{activo.nombre_maquina}</h2>
        <p className="text-sm font-mono text-gray-500 mb-6">{activo.identificador}</p>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-200">
            {/* AQUÍ TAMBIÉN: Le agregamos "INFO:" para que el kiosco sepa qué es */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=INFO:${activo.identificador}`} alt="QR" className="w-48 h-48" />
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={descargarQR} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors">
            ⬇️ Descargar Etiqueta QR Física
          </button>
          <button onClick={onClose} className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-xl font-bold transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}