import { router } from 'expo-router';
import { ProductDetailContent } from './product-detail-content';

interface HistoryProductDetailScreenProps {
  upc: string;
}

/**
 * Product detail screen for the History tab
 * Separate from Find to avoid tab navigation conflicts
 * Does not add to history (already in history list)
 */
export function HistoryProductDetailScreen({ upc }: HistoryProductDetailScreenProps) {
    const handleBack = () => {
        router.back();
    };

    return <ProductDetailContent upc={upc} onBack={handleBack} />;
}
