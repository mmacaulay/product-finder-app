import { BarcodeScanningResult } from "expo-camera";

export default function BarcodeLookup (barcode: BarcodeScanningResult) {
  console.log('Barcode scanned:', barcode);
};