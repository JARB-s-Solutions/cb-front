import { useEffect } from 'react';
import { useClients } from '../hooks/useClients';

const ClientsPage = () => {
  const { clients, isLoading, fetchClients, deleteClient } = useClients();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Directorio de Clientes</h1>
        <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined">add</span>
          Nuevo Cliente
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-400">Cargando clientes...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map(client => (
            <div key={client.id} className="bg-secondary p-4 rounded-xl border border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={() => deleteClient(client.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">call</span>
                {client.phone || 'Sin teléfono'}
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-xs">mail</span>
                {client.email || 'Sin correo'}
              </p>
            </div>
          ))}
          {clients.length === 0 && !isLoading && (
            <p className="text-gray-500 col-span-full">No tienes clientes registrados aún.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;