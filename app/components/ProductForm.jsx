import {Link, useNavigate} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div
      className="product-form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div
            className="product-options"
            key={option.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <h5
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                margin: '0',
              }}
            >
              {option.name}
            </h5>
            <div
              className="product-options-grid"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const commonStyles = {
                  padding: swatch ? '0' : '0.5rem 1rem',
                  borderRadius: swatch ? '50%' : '0.375rem',
                  border: selected ? '2px solid #000000' : '1px solid #e5e7eb',
                  opacity: available ? 1 : 0.3,
                  cursor: exists ? 'pointer' : 'not-allowed',
                  minWidth: swatch ? '40px' : '48px',
                  height: swatch ? '40px' : 'auto',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                };

                if (isDifferentProduct) {
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={commonStyles}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      style={commonStyles}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
        style={{
          width: '100%',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          backgroundColor: selectedVariant?.availableForSale
            ? '#000000'
            : '#e5e7eb',
          color: selectedVariant?.availableForSale ? '#ffffff' : '#6b7280',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: selectedVariant?.availableForSale ? 'pointer' : 'not-allowed',
          border: 'none',
          transition: 'background-color 0.2s ease',
        }}
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span style={{fontSize: '0.875rem'}}>{name}</span>;
  }

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {!!image && (
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
