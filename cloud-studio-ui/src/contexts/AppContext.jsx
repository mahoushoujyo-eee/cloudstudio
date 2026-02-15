import { createContext, useContext, useMemo, useRef, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const globalSearchRef = useRef(null);

  const value = useMemo(
    () => ({
      globalSearch,
      setGlobalSearch,
      globalSearchRef,
    }),
    [globalSearch],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
};
