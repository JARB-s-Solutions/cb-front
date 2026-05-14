import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFinance } from '../hooks/useFinance';

export function FinancePage() {
  const { 
    summary, history, closes = [], isLoading, 
    fetchSummary, fetchHistory, fetchCloses, 
    openDay, closeDay, undoClose, createTransaction 
  } = useFinance();

  const [isOpenModalActive, setIsOpenModalActive] = useState(false);
  const [isTxModalActive, setIsTxModalActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para transiciones instantáneas de UI
  const [uiForceStatus, setUiForceStatus] = useState(null); 

  const [initialCash, setInitialCash] = useState('');
  const [txForm, setTxForm] = useState({ type: 'WITHDRAWAL', amount: '', method: 'CASH', description: '' });

  useEffect(() => {
    fetchSummary();
    fetchHistory();
    if (fetchCloses) fetchCloses();
  }, [fetchSummary, fetchHistory, fetchCloses]);

  const handleOpenDay = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await openDay(initialCash || 0);
    if (success) {
      setIsOpenModalActive(false);
      setUiForceStatus('OPEN');
    }
    setIsSaving(false);
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await createTransaction(txForm);
    if (success) {
      setIsTxModalActive(false);
      setTxForm({ type: 'WITHDRAWAL', amount: '', method: 'CASH', description: '' });
    }
    setIsSaving(false);
  };

  const handleCloseDay = async () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar la caja de hoy? No podrás registrar más movimientos.")) {
      const success = await closeDay();
      if (success) {
        setUiForceStatus('CLOSED'); 
        if (fetchCloses) fetchCloses(); 
      }
    }
  };

  const handleUndoClose = async () => {
    if (window.confirm("¿Deseas reabrir la caja? Podrás registrar más ventas o movimientos el día de hoy.")) {
      const success = await undoClose();
      if (success) {
        setUiForceStatus('OPEN'); 
        if (fetchSummary) fetchSummary();
      }
    }
  };

  if (isLoading && !summary) {
    return <div className="p-6 text-gray-400 flex items-center gap-2"><span className="material-symbols-outlined animate-spin text-red-500">refresh</span> Cargando datos financieros...</div>;
  }

  // --- LÓGICA DE FECHAS SEGURA ---
  let todayCloseRecord = closes.find(c => new Date(c.date).toDateString() === new Date().toDateString());

  if (!todayCloseRecord && closes.length > 0) {
    const lastClose = closes[0];
    const diffHours = Math.abs(new Date() - new Date(lastClose.date)) / (1000 * 60 * 60);
    if (diffHours < 24) {
      todayCloseRecord = lastClose;
    }
  }

  let isClosedToday = !!todayCloseRecord;

  if (uiForceStatus === 'CLOSED') isClosedToday = true;
  if (uiForceStatus === 'OPEN') isClosedToday = false;

  const isPendingOpen = summary?.status === 'CLOSED_OR_PENDING';
  const isBoxOpen = summary?.status === 'OPEN' && !isClosedToday;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Caja y Finanzas</h1>
          <p className="text-gray-400 text-sm mt-1">Gestiona tu flujo de efectivo diario</p>
        </div>
        
        {/* Acciones principales solo visibles si la caja está abierta */}
        {isBoxOpen && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsTxModalActive(true)}
              className="bg-[#141414] border border-gray-700 hover:border-gray-500 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
              Registrar Movimiento
            </button>
            <button 
              onClick={handleCloseDay}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 font-medium shadow-sm shadow-red-900/20"
            >
              <span className="material-symbols-outlined text-[20px]">lock</span>
              Cerrar Caja
            </button>
          </div>
        )}
      </div>

      {/* BANNER 1: DÍA FINALIZADO */}
      {isClosedToday && (
        <div className="bg-gradient-to-r from-blue-900/40 to-blue-900/10 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-blue-900/10">
          <div className="flex items-center gap-5">
            <div className="bg-blue-500/20 p-3.5 rounded-full border border-blue-500/30">
              <span className="material-symbols-outlined text-blue-400 text-3xl">task_alt</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Turno Finalizado</h2>
              <p className="text-blue-200/70 text-sm">La caja fue cerrada exitosamente. Ya no puedes registrar más operaciones hoy.</p>
              
              {todayCloseRecord && (
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="bg-blue-950/50 px-3 py-1 rounded-lg border border-blue-800/50 text-blue-300">
                    Efectivo: <strong className="text-white">${Number(todayCloseRecord.totalCash).toFixed(2)}</strong>
                  </span>
                  <span className="bg-blue-950/50 px-3 py-1 rounded-lg border border-blue-800/50 text-blue-300">
                    Transferencias: <strong className="text-white">${Number(todayCloseRecord.totalTransfer).toFixed(2)}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={handleUndoClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors whitespace-nowrap shadow-sm"
          >
            Reabrir Caja
          </button>
        </div>
      )}

      {/* BANNER 2: PENDIENTE DE APERTURA */}
      {isPendingOpen && !isClosedToday && (
        <div className="bg-gradient-to-r from-red-900/30 to-red-900/5 border border-red-500/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-red-900/10">
          <div className="flex items-center gap-5">
            <div className="bg-red-500/20 p-3.5 rounded-full border border-red-500/30">
              <span className="material-symbols-outlined text-red-400 text-3xl">point_of_sale</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Caja Cerrada</h2>
              <p className="text-red-200/70 text-sm">Debes indicar tu base de efectivo inicial para comenzar a cobrar citas y registrar movimientos.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpenModalActive(true)}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors whitespace-nowrap shadow-sm shadow-green-900/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">lock_open</span>
            Iniciar Turno
          </button>
        </div>
      )}

      {/* SECCIÓN DE DATOS (SIEMPRE VISIBLE) */}
      <div className={`transition-opacity duration-300 ${(isClosedToday || isPendingOpen) ? 'opacity-70 grayscale-[30%]' : 'opacity-100'}`}>
        
        {/* GRID DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#141414] p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">payments</span> Base Inicial</p>
            <p className="text-2xl font-bold text-white">${summary?.initialBase?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-[#141414] p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">trending_up</span> Ingresos del Día</p>
            <p className="text-2xl font-bold text-green-500">
              + ${( (summary?.inflow?.services || 0) + (summary?.inflow?.manual || 0) ).toFixed(2)}
            </p>
          </div>
          <div className="bg-[#141414] p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">trending_down</span> Retiros / Gastos</p>
            <p className="text-2xl font-bold text-red-500">- ${summary?.outflow?.withdrawals?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-[#1a1515] p-5 rounded-xl border border-red-900/30">
            <p className="text-red-400 text-sm mb-1 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">account_balance_wallet</span> Efectivo Estimado</p>
            <p className="text-3xl font-bold text-red-500">${summary?.balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* TABLA DE MOVIMIENTOS */}
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-800 bg-gray-900/30">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">history</span>
              Historial de Hoy
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/50 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-4 font-medium whitespace-nowrap">Concepto</th>
                  <th className="p-4 font-medium">Método</th>
                  <th className="p-4 font-medium">Tipo</th>
                  <th className="p-4 font-medium text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.length === 0 ? (
                  <tr><td colSpan="4" className="p-12 text-center text-gray-500">No hay movimientos registrados hoy</td></tr>
                ) : (
                  history.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 text-white font-medium">{tx.concept}</td>
                      <td className="p-4 text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">
                            {tx.method === 'CASH' ? 'payments' : 'credit_card'}
                          </span>
                          {tx.method === 'CASH' ? 'Efectivo' : 'Transferencia'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${tx.type === 'WITHDRAWAL' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                          {tx.type === 'WITHDRAWAL' ? 'Retiro' : 'Ingreso'}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-bold ${tx.type === 'WITHDRAWAL' ? 'text-red-400' : 'text-green-400'}`}>
                        {tx.type === 'WITHDRAWAL' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ================= MODALES INFALIBLES ================= */}

      {/* MODAL: ABRIR CAJA */}
      {isOpenModalActive && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setIsOpenModalActive(false)}></div>
          <div style={{ position: 'relative', backgroundColor: '#1a1a1a', width: '100%', maxWidth: '24rem', borderRadius: '1rem', border: '1px solid #374151', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="p-5 border-b border-gray-800 bg-[#141414] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">lock_open</span> Apertura de Caja
              </h2>
              <button onClick={() => setIsOpenModalActive(false)} className="text-gray-400 hover:text-white transition-colors bg-gray-800/50 p-1 rounded-lg">
                <span className="material-symbols-outlined text-xl block">close</span>
              </button>
            </div>
            <form onSubmit={handleOpenDay} className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Base en Efectivo (Dinero inicial en caja)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number" min="0" step="0.01" required
                    value={initialCash} onChange={(e) => setInitialCash(e.target.value)}
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl pl-9 pr-4 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-lg transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-50 transition-colors flex justify-center items-center gap-2">
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Abriendo...</>
                ) : (
                  'Iniciar Turno'
                )}
              </button>
            </form>
          </div>
        </div>, document.body
      )}

      {/* MODAL: REGISTRAR MOVIMIENTO MANUAL */}
      {isTxModalActive && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setIsTxModalActive(false)}></div>
          <div style={{ position: 'relative', backgroundColor: '#1a1a1a', width: '100%', maxWidth: '28rem', borderRadius: '1rem', border: '1px solid #374151', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="p-5 border-b border-gray-800 bg-[#141414] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">sync_alt</span> Nuevo Movimiento
              </h2>
              <button onClick={() => setIsTxModalActive(false)} className="text-gray-400 hover:text-white transition-colors bg-gray-800/50 p-1 rounded-lg">
                <span className="material-symbols-outlined text-xl block">close</span>
              </button>
            </div>
            <form onSubmit={handleTxSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Tipo</label>
                  <select 
                    value={txForm.type} onChange={(e) => setTxForm({...txForm, type: e.target.value})}
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl px-3 py-2.5 outline-none focus:border-red-500"
                  >
                    <option value="WITHDRAWAL">Retiro / Gasto</option>
                    <option value="OTHER">Ingreso Extra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Método</label>
                  <select 
                    value={txForm.method} onChange={(e) => setTxForm({...txForm, method: e.target.value})}
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl px-3 py-2.5 outline-none focus:border-red-500"
                  >
                    <option value="CASH">Efectivo</option>
                    <option value="TRANSFER">Transferencia</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Monto <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number" min="0.1" step="0.01" required
                    value={txForm.amount} onChange={(e) => setTxForm({...txForm, amount: e.target.value})}
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Concepto / Descripción <span className="text-red-500">*</span></label>
                <input
                  type="text" required
                  value={txForm.description} onChange={(e) => setTxForm({...txForm, description: e.target.value})}
                  placeholder="Ej. Compra de insumos, Pago de luz..."
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold disabled:opacity-50 transition-colors flex justify-center items-center gap-2">
                  {isSaving ? (
                    <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Guardando...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[20px]">save</span> Registrar Movimiento</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>, document.body
      )}

    </div>
  );
}