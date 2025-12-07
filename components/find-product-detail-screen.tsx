import { useHistory } from '@/contexts/HistoryContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ProductDetailContent } from './product-detail-content';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCT, type GetProductQuery } from '@/graphql/queries';

interface FindProductDetailScreenProps {
  upc: string;
}

/**
 * Product detail screen for the Find tab
 * Separate from History to avoid tab navigation conflicts
 */
export function FindProductDetailScreen({ upc }: FindProductDetailScreenProps) {
    const { addToHistory } = useHistory();

    // Query to get product data for history tracking
    const { loading, error, data } = useQuery<GetProductQuery>(GET_PRODUCT, {
        variables: { upc },
        fetchPolicy: 'cache-first',
    });

    // Add to history when we get a successful response
    useEffect(() => {
        if (data !== undefined && !loading && !error) {
            const product = data.productByUpc;
            addToHistory({
                upc,
                product: product ? {
                    name: product.name,
                    brand: product.brand,
                    upcCode: product.upcCode,
                    imageUrl: product.imageUrl,
                } : null,
            });
        }
    }, [data, loading, error, upc, addToHistory]);

    const handleBack = () => {
        router.back();
    };

    return <ProductDetailContent upc={upc} onBack={handleBack} />;
}
