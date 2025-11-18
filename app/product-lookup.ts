import { useQuery } from "@apollo/client/react";
import type { BarcodeScanningResult } from "expo-camera";
import type { GetProductQuery } from "./__generated__/graphql";
import { GET_PRODUCT } from "./queries";

export default function useProductLookup (barcode: BarcodeScanningResult) : ProductInfo {
  console.log('Looking up product:', barcode);
  const { loading, error, data } = useQuery<GetProductQuery>(GET_PRODUCT, {
    variables: { upc: barcode.data },
  });

  const product = data?.productByUpc;

  if (loading) return { upcCode: '', brand: '', name: '' };
  if (error) return { upcCode: '', brand: '', name: '' };
  if (!product) return { upcCode: '', brand: '', name: '' };
  
  console.log('Product data:', data);
  return {
    upcCode: product.upcCode || '',
    brand: product.brand || '',
    name: product.name || '',
  };
};

export interface ProductInfo {
  upcCode: string
  brand: string | null
  name: string
}