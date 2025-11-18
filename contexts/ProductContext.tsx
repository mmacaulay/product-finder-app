import type { GetProductQuery } from '@/app/__generated__/graphql';
import { createContext, ReactNode, useContext, useState } from 'react';

// Use the generated type from GraphQL codegen
export type ProductData = GetProductQuery;
  
  interface ProductContextType {
    productData: ProductData | null;
    setProductData: (data: ProductData | null) => void;
  }
  
  const ProductContext = createContext<ProductContextType | undefined>(undefined);
  
  export function ProductProvider({ children }: { children: ReactNode }) {
    const [productData, setProductData] = useState<ProductData | null>(null);
  
    return (
      <ProductContext.Provider value={{ productData, setProductData }}>
        {children}
      </ProductContext.Provider>
    );
  }

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
      throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
  }