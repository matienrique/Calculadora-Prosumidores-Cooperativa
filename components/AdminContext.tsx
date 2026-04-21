import React, { createContext, useContext, useState, useEffect } from 'react';

interface TarifaGsfValues {
  [key: string]: number;
}

interface AdminContextType {
  tarifaGsf: TarifaGsfValues;
  setTarifaGsf: (key: string, value: number) => void;
  tipoCambio: number;
  setTipoCambio: (value: number) => void;
  inversionResidencial: number;
  setInversionResidencial: (value: number) => void;
  inversionNoResidencial: number;
  setInversionNoResidencial: (value: number) => void;
}

const defaultValues: TarifaGsfValues = {
  'Residencial': 24.27,
  'Asociaciones': 24.27,
  'Industrial': 40.51,
  'Comercial': 40.51,
  'Gran Demanda': 40.51,
};

const AdminContext = createContext<AdminContextType>({
  tarifaGsf: defaultValues,
  setTarifaGsf: () => {},
  tipoCambio: 1400,
  setTipoCambio: () => {},
  inversionResidencial: 1500,
  setInversionResidencial: () => {},
  inversionNoResidencial: 1100,
  setInversionNoResidencial: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarifaGsf, setTarifaGsfState] = useState<TarifaGsfValues>(() => {
    const saved = sessionStorage.getItem('admin_tarifaGsf');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return defaultValues; }
    }
    return defaultValues;
  });

  const [tipoCambio, setTipoCambioState] = useState<number>(() => {
    const saved = sessionStorage.getItem('admin_tipoCambio');
    return saved ? parseFloat(saved) : 1400;
  });

  const [inversionResidencial, setInversionResidencialState] = useState<number>(() => {
    const saved = sessionStorage.getItem('admin_inversionResidencial');
    return saved ? parseFloat(saved) : 1500;
  });

  const [inversionNoResidencial, setInversionNoResidencialState] = useState<number>(() => {
    const saved = sessionStorage.getItem('admin_inversionNoResidencial');
    return saved ? parseFloat(saved) : 1100;
  });

  useEffect(() => {
    sessionStorage.setItem('admin_tarifaGsf', JSON.stringify(tarifaGsf));
  }, [tarifaGsf]);

  useEffect(() => {
    sessionStorage.setItem('admin_tipoCambio', tipoCambio.toString());
  }, [tipoCambio]);

  useEffect(() => {
    sessionStorage.setItem('admin_inversionResidencial', inversionResidencial.toString());
  }, [inversionResidencial]);

  useEffect(() => {
    sessionStorage.setItem('admin_inversionNoResidencial', inversionNoResidencial.toString());
  }, [inversionNoResidencial]);

  const setTarifaGsf = (key: string, value: number) => {
    setTarifaGsfState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminContext.Provider value={{
      tarifaGsf, setTarifaGsf,
      tipoCambio, setTipoCambio: setTipoCambioState,
      inversionResidencial, setInversionResidencial: setInversionResidencialState,
      inversionNoResidencial, setInversionNoResidencial: setInversionNoResidencialState
    }}>
      {children}
    </AdminContext.Provider>
  );
};

