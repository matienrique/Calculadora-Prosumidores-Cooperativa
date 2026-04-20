import React, { createContext, useContext, useState, useEffect } from 'react';

interface TarifaGsfValues {
  [key: string]: number;
}

interface AdminContextType {
  tarifaGsf: TarifaGsfValues;
  setTarifaGsf: (key: string, value: number) => void;
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
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarifaGsf, setTarifaGsfState] = useState<TarifaGsfValues>(() => {
    const saved = sessionStorage.getItem('admin_tarifaGsf');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultValues;
      }
    }
    return defaultValues;
  });

  useEffect(() => {
    sessionStorage.setItem('admin_tarifaGsf', JSON.stringify(tarifaGsf));
  }, [tarifaGsf]);

  const setTarifaGsf = (key: string, value: number) => {
    setTarifaGsfState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminContext.Provider value={{ tarifaGsf, setTarifaGsf }}>
      {children}
    </AdminContext.Provider>
  );
};

