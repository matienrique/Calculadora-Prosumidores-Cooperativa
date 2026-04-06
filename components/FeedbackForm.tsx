import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface Props {
  userType: string;
}

const FeedbackForm: React.FC<Props> = ({ userType }) => {
  const [resolved, setResolved] = useState<boolean | null>(null);
  const [observations, setObservations] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (resolved === null) {
      alert('Por favor, selecciona si obtuviste la respuesta que buscabas.');
      return;
    }

    setLoading(true);
    try {
      // Get the next consultation number
      const statsRef = collection(db, 'stats');
      const q = query(statsRef, orderBy('number', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      let nextNumber = 1;
      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[0].data();
        nextNumber = (lastDoc.number || 0) + 1;
      }

      await addDoc(statsRef, {
        number: nextNumber,
        date: new Date().toISOString(),
        userType,
        resolved,
        observations
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Hubo un error al guardar tu respuesta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center animate-fadeIn">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">¡Muchas gracias!</h3>
        <p className="text-green-700">Tu feedback nos ayuda a mejorar el simulador para todos los usuarios.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">¿Obtuvo la respuesta que buscaba?</h3>
        <p className="text-slate-500 text-sm">Tu opinión es muy importante para nosotros.</p>
      </div>

      <div className="flex justify-center gap-8">
        <button
          onClick={() => setResolved(true)}
          className={`group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
            resolved === true 
              ? 'bg-green-100 border-2 border-green-500 scale-110' 
              : 'bg-slate-50 border-2 border-transparent hover:bg-green-50'
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110 ${
            resolved === true ? 'bg-green-500 text-white' : 'bg-white text-green-500 shadow-sm'
          }`}>
            ✓
          </div>
          <span className={`font-bold uppercase tracking-widest text-xs ${resolved === true ? 'text-green-700' : 'text-slate-500'}`}>Si</span>
        </button>

        <button
          onClick={() => setResolved(false)}
          className={`group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
            resolved === false 
              ? 'bg-red-100 border-2 border-red-500 scale-110' 
              : 'bg-slate-50 border-2 border-transparent hover:bg-red-50'
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110 ${
            resolved === false ? 'bg-red-500 text-white' : 'bg-white text-red-500 shadow-sm'
          }`}>
            ✕
          </div>
          <span className={`font-bold uppercase tracking-widest text-xs ${resolved === false ? 'text-red-700' : 'text-slate-500'}`}>No</span>
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Observaciones / Recomendaciones</label>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Escribe aquí tus comentarios..."
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px] text-slate-700"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading || resolved === null}
          className={`bg-gradient-to-r from-[#FF5F6D] to-[#B83AF3] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            'Guardar respuestas'
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
