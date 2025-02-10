import {CartForm} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

/**
 * A button that adds items to the cart.
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  return (
    <CartForm
      route="/cart"
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
      onSuccess={() => setAddedToCart(true)}
    >
      {(fetcher) => {
        const isAdding = fetcher.state !== 'idle';

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={(e) => {
                onClick?.(e);
              }}
              disabled={disabled ?? isAdding}
              className={`w-full px-7 py-3.5 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${
                  disabled || isAdding
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900 cursor-pointer'
                }`}
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </div>
              ) : addedToCart ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Added to Cart!
                </div>
              ) : (
                children
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
