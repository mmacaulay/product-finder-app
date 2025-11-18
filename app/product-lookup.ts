import { useQuery } from "@apollo/client/react";
import { BarcodeScanningResult } from "expo-camera";
import { GET_PRODUCT } from "./queries";
import { ProductData } from "@/contexts/ProductContext";

export default function productLookup (barcode: BarcodeScanningResult) : ProductInfo {
  console.log('Looking up product:', barcode);
  const { loading, error, data } = useQuery<ProductData>(GET_PRODUCT, {
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