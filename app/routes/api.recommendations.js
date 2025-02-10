import {json} from '@shopify/remix-oxygen';

const RECOMMENDATIONS_QUERY = `#graphql
  query GetRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
    }
  }
`;

// Update to use Shopify's Storefront API endpoint
//const AI_RECOMMENDATIONS_URL =
//  'https://quickstart-75eeb56f.myshopify.com/api/2024-01/graphql.json';
const AI_RECOMMENDATIONS_URL =
  'https://hydrogenstore.myshopify.com/api/2024-01';
const API_KEY = '';

export async function loader({request, context}) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');

  if (!productId) {
    return json({error: 'Product ID is required'}, {status: 400});
  }

  try {
    // First get Shopify recommendations
    const {productRecommendations} = await context.storefront.query(
      RECOMMENDATIONS_QUERY,
      {
        variables: {
          productId,
          country: 'US',
          language: 'EN',
        },
        cache: context.storefront.CacheShort(),
      },
    );

    // Then get AI-powered recommendations using Storefront API
    const aiResponse = await fetch(AI_RECOMMENDATIONS_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query getRelatedProducts($productId: ID!) {
            product(id: $productId) {
              recommendations(intent: RELATED) {
                id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        `,
        variables: {
          productId,
        },
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to fetch AI recommendations');
    }

    const aiData = await aiResponse.json();
    const aiRecommendations = aiData.data?.product?.recommendations || [];

    // Merge and deduplicate recommendations
    const allRecommendations = [
      ...(productRecommendations || []).map((product) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        price: product.priceRange.minVariantPrice.amount,
        currencyCode: 'USD',
        imageUrl: product.featuredImage?.url,
        imageAlt: product.featuredImage?.altText,
        source: 'shopify',
      })),
      ...aiRecommendations.map((product) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        price: product.priceRange.minVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode || 'USD',
        imageUrl: product.featuredImage?.url,
        imageAlt: product.featuredImage?.altText,
        source: 'ai',
      })),
    ];

    // Remove duplicates based on product ID
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map((item) => [item.id, item])).values(),
    );

    // Sort recommendations - prioritize AI recommendations
    const sortedRecommendations = uniqueRecommendations.sort((a, b) => {
      if (a.source === 'ai' && b.source !== 'ai') return -1;
      if (a.source !== 'ai' && b.source === 'ai') return 1;
      return 0;
    });

    return json({
      recommendations: sortedRecommendations.slice(0, 8), // Limit to 8 recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);

    try {
      // Fallback to Shopify recommendations only if AI recommendations fail
      const {productRecommendations} = await context.storefront.query(
        RECOMMENDATIONS_QUERY,
        {
          variables: {
            productId,
            country: 'US',
            language: 'EN',
          },
          cache: context.storefront.CacheShort(),
        },
      );

      if (productRecommendations) {
        return json({
          recommendations: productRecommendations.map((product) => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            price: product.priceRange.minVariantPrice.amount,
            currencyCode: 'USD',
            imageUrl: product.featuredImage?.url,
            imageAlt: product.featuredImage?.altText,
            source: 'shopify',
          })),
        });
      }
    } catch (shopifyError) {
      console.error('Error fetching Shopify recommendations:', shopifyError);
    }

    return json(
      {error: 'Failed to fetch recommendations. Please try again later.'},
      {status: 500},
    );
  }
}
