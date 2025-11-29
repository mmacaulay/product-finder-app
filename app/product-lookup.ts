import { useQuery } from "@apollo/client/react";
import type { BarcodeScanningResult } from "expo-camera";
import type { GetProductQuery } from "./__generated__/graphql";
import { GET_PRODUCT } from "./queries";

export default function useProductLookup (barcode: BarcodeScanningResult) : ProductInfo {
  const { loading, error, data } = useQuery<GetProductQuery>(GET_PRODUCT, {
    variables: { upc: barcode.data },
  });

  const product = data?.productByUpc;

  if (loading) return { upcCode: '', brand: '', name: '' };
  if (error) return { upcCode: '', brand: '', name: '' };
  if (!product) return { upcCode: '', brand: '', name: '' };

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