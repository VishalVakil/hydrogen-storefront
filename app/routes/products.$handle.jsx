import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {ProductGallery} from '~/components/ProductGallery';
import {Reviews} from '~/components/Reviews';
import {ProductRecommendations} from '~/components/ProductRecommendations';
import {StickyAddToCartBar} from '~/components/StickyAddToCartBar';

// Example: If you want to add structured data globally, you can import a custom <Seo> or <Helmet> component
// or we can inline the JSON-LD script below.

export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // The critical product query with caching:
  const productPromise = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
    },
    cache: storefront.CacheLong(), // <-- Caching for performance
  });
  // console.log('Product Data:', JSON.stringify(productPromise, null, 2));

  const [productResult] = await Promise.all([productPromise]);

  const product = productResult?.product;
  if (!product?.id) {
    throw new Response('Not Found', {status: 404});
  }

  // Return deferred data if you have additional non-critical queries:
  return defer({
    product,
    // e.g. mock or extra queries for reviews:
    reviews: fetchReviewsMock(product.id),
    // or AI-based recommendations:
    // recommendations: fetchAiRecommendationsMock(product.id),
  });
}

// Example mock function to simulate a reviews API request
async function fetchReviewsMock(productId) {
  return [
    {
      id: 1,
      author: 'John Doe',
      rating: 5,
      content: 'Amazing product!',
      createdAt: '2024-02-08T10:00:00Z',
      verifiedPurchase: true,
      helpfulVotes: 12,
    },
    {
      id: 2,
      author: 'Jane Smith',
      rating: 4,
      content: 'Works well, but could be better',
      createdAt: '2024-02-07T15:30:00Z',
      verifiedPurchase: true,
      helpfulVotes: 8,
    },
  ];
}

export default function Product() {
  const {product, reviews} = useLoaderData();

  // Select the correct variant (optimistic approach).
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Keep the URL search params in sync with the selected variant
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Build an array of product options (for your <ProductForm>)
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, images} = product;

  // Example structured data for SEO
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    brand: product.vendor,
    sku: selectedVariant?.sku || '',
    image: images?.nodes?.map((img) => img.url) || [],
    offers: {
      '@type': 'Offer',
      price: selectedVariant?.price?.amount || '',
      priceCurrency: selectedVariant?.price?.currencyCode || 'USD',
      availability: selectedVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="product grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductGallery product={product} />

            <div className="product-main space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900">
                  Description
                </h2>
                <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
              </div>

              <Reviews productId={product.id} reviews={reviews} />
              <ProductRecommendations productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      <StickyAddToCartBar product={product} selectedVariant={selectedVariant} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    # Add 'images' for your carousel
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;
