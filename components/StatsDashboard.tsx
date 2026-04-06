import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  getDocs, 
  writeBatch,
  getDoc
} from 'firebase/firestore';

interface Feedback {
  id: string;
  number: number;
  date: string;
  userType: string;
  resolved: boolean;
  observations: string;
}

const StatsDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<Feedback[]>([]);
  const [visitCount, setVisitCount] = useState<number>(23);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthorized) return;

    // Listen to stats
    const statsRef = collection(db, 'stats');
    const q = query(statsRef, orderBy('number', 'desc'));
    const unsubscribeStats = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Feedback[];
      setStats(data);
      setLoading(false);
    });

    // Listen to visit count
    const metadataRef = doc(db, 'metadata', 'global');
    const unsubscribeMetadata = onSnapshot(metadataRef, (snapshot) => {
      if (snapshot.exists()) {
        setVisitCount(snapshot.data().visitCount || 23);
      }
    });

    return () => {
      unsubscribeStats();
      unsubscribeMetadata();
    };
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Energia25#') {
      setIsAuthorized(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const statsRef = collection(db, 'stats');
      const snapshot = await getDocs(statsRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting stats:', error);
      alert('Error al borrar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-200 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Acceso Restringido</h2>
          <p className="text-slate-500 text-sm mt-2">Ingrese la contraseña de administrador para ver las estadísticas.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-center text-lg"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF5F6D] to-[#B83AF3] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-slate-400 hover:text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em] py-2"
            >
              Volver al Simulador
            </button>
          </div>
        </form>
      </div>
    );
  }

  const resolvedCount = stats.filter(s => s.resolved).length;
  const unresolvedCount = stats.filter(s => !s.resolved).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Estadísticas del Sistema
          </h2>
          <p className="text-slate-500 font-medium">Panel de control de feedback y visitas.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Borrar datos
          </button>
          <button
            onClick={onBack}
            className="bg-slate-800 text-white hover:bg-slate-900 px-6 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Visitas Totales</p>
          <p className="text-4xl font-black text-slate-800">{visitCount}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] mb-2">Resolvieron Consulta</p>
          <p className="text-4xl font-black text-green-600">{resolvedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-2">No Resolvieron</p>
          <p className="text-4xl font-black text-red-600">{unresolvedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Número</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo de Usuario</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resolvió</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No hay consultas registradas aún.</td>
                </tr>
              ) : (
                stats.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 font-bold text-slate-800">#{item.number}</td>
                    <td className="p-6 text-sm text-slate-600">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-6 text-sm font-medium text-slate-700">{item.userType}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.resolved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.resolved ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-slate-600 max-w-xs truncate" title={item.observations}>
                      {item.observations || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center uppercase tracking-tight mb-2">¿Seguro que desea borrar los datos?</h3>
            <p className="text-slate-500 text-center text-sm mb-8">Esta acción eliminará todas las consultas registradas. Las visitas a la página no se verán afectadas.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Borrar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
