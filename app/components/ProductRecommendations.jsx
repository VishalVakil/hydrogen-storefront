import {useEffect, useState} from 'react';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export function ProductRecommendations({productId}) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/recommendations?productId=${productId}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Unable to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  if (error) {
    return null; // Hide the section if there's an error
  }

  if (isLoading) {
    return (
      <section className="w-full py-8">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="group"
          >
            <div className="aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <Image
                  data={{
                    url: product.imageUrl,
                    altText: product.imageAlt || product.title,
                    width: 400,
                    height: 400,
                  }}
                  className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {product.title}
            </h3>
            <Money
              withoutTrailingZeros
              data={{
                amount: product.price,
                currencyCode: 'USD', // Force USD currency
              }}
              className="text-sm text-gray-500"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
