import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGallery } from '../hooks/useGallery';

export function GalleryPage() {
  const { images = [], isLoading, fetchGallery, uploadImage, deleteImage } = useGallery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const openModal = () => {
    setFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor selecciona una imagen");
      return;
    }
    
    setIsSaving(true);
    
    // Armamos el FormData (El backend usa upload.single('image'))
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    const success = await uploadImage(uploadData);
    if (success) closeModal();
    
    setIsSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar esta imagen de tu portafolio?`)) {
      await deleteImage(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Portafolio</h1>
          <p className="text-gray-400 text-sm mt-1">Sube fotos de tus trabajos para atraer más clientes</p>
        </div>
        <button 
          onClick={openModal}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium shadow-sm shadow-red-900/20"
        >
          <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
          Subir Foto
        </button>
      </div>

      {/* GALERÍA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-400 gap-2">
          <span className="material-symbols-outlined animate-spin text-red-500">refresh</span>
          Cargando imágenes...
        </div>
      ) : images.length === 0 ? (
        <div className="bg-[#141414] border border-dashed border-gray-700 rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">collections</span>
          <h2 className="text-xl font-bold text-white mb-2">Aún no tienes fotos</h2>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            Muestra tus mejores cortes y diseños. Las fotos que subas aquí aparecerán en tu Perfil Público.
          </p>
          <button 
            onClick={openModal}
            className="bg-[#1a1a1a] border border-gray-700 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
          >
            Seleccionar primera foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map(image => (
            <div key={image.id} className="group relative bg-[#141414] rounded-xl overflow-hidden border border-gray-800 aspect-square shadow-sm">
              <img 
                src={image.imageUrl} 
                alt="Trabajo de barbería" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button 
                  onClick={() => handleDelete(image.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PARA SUBIR FOTO */}
      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }} onClick={closeModal}></div>
          
          <div style={{ position: 'relative', backgroundColor: '#1a1a1a', width: '100%', maxWidth: '28rem', borderRadius: '1rem', border: '1px solid #374151', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="p-5 border-b border-gray-800 bg-[#141414] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">add_photo_alternate</span>
                Nueva Foto
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors bg-gray-800/50 p-1 rounded-lg">
                <span className="material-symbols-outlined text-xl block">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden transition-colors ${previewUrl ? 'border-gray-700 bg-black/50' : 'border-gray-700 hover:border-red-500 hover:bg-gray-800/50'}`}
                style={{ minHeight: '220px' }}
              >
                <input 
                  type="file" accept="image/png, image/jpeg, image/webp" 
                  className="hidden" ref={fileInputRef} onChange={handleFileChange}
                />
                
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black/80" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-5xl text-gray-500 mb-3">cloud_upload</span>
                    <p className="text-sm font-medium text-gray-300">Toca para explorar tus archivos</p>
                    <p className="text-xs text-gray-500 mt-2">Soporta JPG, PNG, WEBP (Max 5MB)</p>
                  </>
                )}
                
                {previewUrl && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-medium bg-black/80 px-4 py-2 rounded-lg border border-gray-700">Cambiar selección</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSaving || !file} className="w-full mt-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold disabled:opacity-50 transition-colors flex justify-center items-center gap-2">
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Subiendo a la nube...</>
                ) : (
                  'Subir Foto al Portafolio'
                )}
              </button>
            </form>
          </div>
        </div>, document.body
      )}

    </div>
  );
}