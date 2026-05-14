import { useState, useEffect } from 'react';
import { useClients } from '../hooks/useClients';

export function ClientsPage() {
  const { clients = [], isLoading, fetchClients, updateClient, deleteClient } = useClients();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchName = client?.name?.toLowerCase()?.includes(term);
    const matchPhone = client?.phone?.includes(searchTerm);
    const matchEmail = client?.email?.toLowerCase()?.includes(term);
    return matchName || matchPhone || matchEmail;
  });

  const openModal = (client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        email: client.email || '',
        notes: client.notes || ''
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingClient && updateClient) {
        // Solo mandamos actualizar, ya no hay opción de crear
        const success = await updateClient(editingClient.id, formData);
        if (success) closeModal();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (deleteClient) await deleteClient(id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Directorio de Clientes</h1>
          <p className="text-gray-400 text-sm mt-1">Gestiona la información y notas de tus clientes</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#141414] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-500 w-full sm:w-64"
            />
          </div>
          {/* El botón de Nuevo Cliente se remueve en MVP para coincidir con backend */}
        </div>
      </div>

      {/* Grid de Clientes */}
      {isLoading ? (
        <div className="text-gray-400 flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-red-500">refresh</span>
          Cargando clientes...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredClients.map(client => (
            <div key={client.id} className="bg-[#141414] p-5 rounded-xl border border-gray-800 relative shadow-sm hover:border-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white truncate pr-16" title={client.name}>
                  {client.name || 'Sin nombre'}
                </h3>
                <div className="flex gap-2 absolute top-4 right-4">
                  <button onClick={() => openModal(client)} className="text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  {/* El botón de eliminar se mantiene visible pero mostrará alerta MVP al pulsar */}
                  <button onClick={() => handleDelete(client.id, client.name)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">call</span>
                {client.phone || 'Sin teléfono'}
              </p>
              {client.email && (
                 <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                 <span className="material-symbols-outlined text-xs">mail</span>
                 <span className="truncate" title={client.email}>{client.email}</span>
               </p>
              )}
              {client.notes && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500 flex gap-1">
                    <span className="material-symbols-outlined text-[14px]">sticky_note_2</span>
                    <span className="line-clamp-2">{client.notes}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
          {filteredClients.length === 0 && !isLoading && (
            <div className="col-span-full bg-[#141414] p-8 rounded-xl text-center border border-dashed border-gray-800">
              <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">groups</span>
              <p className="text-gray-400">No se encontraron clientes.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL INFALIBLE PARA EDICIÓN */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={closeModal}></div>

          <div style={{ position: 'relative', backgroundColor: '#1a1a1a', width: '100%', maxWidth: '28rem', borderRadius: '1rem', border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#141414]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="material-symbols-outlined text-red-500">manage_accounts</span>
                 Editar Cliente
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">person</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-red-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Campos de Solo Lectura basados en el esquema del Backend MVP */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Teléfono (Solo lectura)</label>
                <div className="relative opacity-60">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">call</span>
                  <input
                    type="tel"
                    readOnly
                    value={formData.phone}
                    className="w-full bg-[#141414] border border-gray-800 text-gray-400 rounded-lg pl-10 pr-4 py-2.5 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Correo Electrónico (Solo lectura)</label>
                <div className="relative opacity-60">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">mail</span>
                  <input
                    type="email"
                    readOnly
                    value={formData.email}
                    className="w-full bg-[#141414] border border-gray-800 text-gray-400 rounded-lg pl-10 pr-4 py-2.5 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Notas Internas</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-gray-500 text-sm">sticky_note_2</span>
                  <textarea
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Preferencias de corte, alergias..."
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#141414] border border-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}