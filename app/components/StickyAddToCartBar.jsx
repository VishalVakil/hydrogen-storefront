import {useEffect, useState} from 'react';
import {AddToCartButton} from './AddToCartButton';
import {Money} from '@shopify/hydrogen';

export function StickyAddToCartBar({product, selectedVariant}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setVisible(y > 30); // Show after scrolling 30px
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!selectedVariant) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 transition-transform duration-300 transform ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        zIndex: 50,
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-medium text-gray-900">
            {product.title}
          </h3>
          {selectedVariant?.price && (
            <Money
              data={selectedVariant.price}
              className="text-lg font-semibold text-gray-900"
            />
          )}
        </div>
        <div className="w-1/3">
          <AddToCartButton
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]}
            disabled={!selectedVariant.availableForSale}
          >
            {selectedVariant.availableForSale ? 'Add to Cart' : 'Sold Out'}
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
