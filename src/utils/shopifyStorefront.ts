/**
 * Client-side Shopify Storefront API.
 * Fetches products directly from Shopify (headless).
 */

const SHOPIFY_API_VERSION = '2026-01';

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE || '';
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export type ShopifyVariant = {
  id: string;
  legacyResourceId: string;
  title: string;
  price: string;
  currencyCode: string;
  availableForSale: boolean;
  benefits?: string[];
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  featuredImage?: { url: string; altText?: string } | null;
  metafields?: {
    location?: { value: string } | null;
    time?: { value: string } | null;
  };
  variants: ShopifyVariant[];
};

function parseGidToNumericId(gid: string): string {
  const parts = gid.split('/');
  return parts[parts.length - 1] || gid;
}

function parseBenefitsList(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return value.split('\n').map((s) => s.trim()).filter(Boolean);
  }
}

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first, query: "status:active") {
      edges {
        node {
          id
          title
          handle
          description
          featuredImage {
            url
            altText
          }
          location: metafield(namespace: "custom", key: "location") {
            value
          }
          time: metafield(namespace: "custom", key: "time") {
            value
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                benefits: metafield(namespace: "custom", key: "benefits") {
                  value
                }
                benefits_list: metafield(namespace: "custom", key: "benefits_list") {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!STORE || !TOKEN) {
    throw new Error('Shopify Storefront API is not configured');
  }

  const url = `https://${STORE}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN.trim(),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

export async function fetchShopifyProducts(
  first: number = 50
): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<{
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          description?: string | null;
          featuredImage?: { url: string; altText?: string } | null;
          location?: { value: string } | null;
          time?: { value: string } | null;
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                price: { amount: string; currencyCode: string };
                availableForSale: boolean;
                benefits?: { value: string } | null;
                benefits_list?: { value: string } | null;
              };
            }>;
          };
        };
      }>;
    };
  }>(PRODUCTS_QUERY, { first });

  return data.products.edges.map(({ node: product }) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    featuredImage: product.featuredImage,
    metafields: {
      location: product.location,
      time: product.time,
    },
    variants: product.variants.edges.map(({ node: v }) => ({
      id: v.id,
      legacyResourceId: parseGidToNumericId(v.id),
      title: v.title,
      price: v.price.amount,
      currencyCode: v.price.currencyCode,
      availableForSale: v.availableForSale,
      benefits: parseBenefitsList(v.benefits?.value ?? v.benefits_list?.value),
    })),
  }));
}
