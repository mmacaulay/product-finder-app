import { createContext, ReactNode, useContext, useState } from 'react';

export interface BarcodeData {
  data: string;
  type: string;
}

interface BarcodeContextType {
  barcodeData: BarcodeData | null;
  setBarcodeData: (data: BarcodeData | null) => void;
}

const BarcodeContext = createContext<BarcodeContextType | undefined>(undefined);

export function BarcodeProvider({ children }: { children: ReactNode }) {
  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null);

  return (
    <BarcodeContext.Provider value={{ barcodeData, setBarcodeData }}>
      {children}
    </BarcodeContext.Provider>
  );
}

export function useBarcode() {
  const context = useContext(BarcodeContext);
  if (context === undefined) {
    throw new Error('useBarcode must be used within a BarcodeProvider');
  }
  return context;
}
