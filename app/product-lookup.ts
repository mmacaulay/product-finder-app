import { useQuery } from "@apollo/client/react";
import { BarcodeScanningResult } from "expo-camera";
import { GET_PRODUCT } from "./queries";

export default function productLookup (barcode: BarcodeScanningResult) : ProductInfo {
  console.log('Looking up product:', barcode);
  const { loading, error,data } = useQuery<ProductInfo>(GET_PRODUCT, {
    variables: { barcode: barcode.data },
  });

  if (loading) return { barcode: '', brand: '', name: '', description: '' };
  if (error) return { barcode: '', brand: '', name: '', description: '' };
  
  console.log('Product data:', data);
  return {
    barcode: data?.barcode || '',
    brand: data?.brand || '',
    name: data?.name || '',
    description: data?.description || '',
  };
};

export interface ProductInfo {
  barcode: String
  brand: String
  name: String
  description: String
}