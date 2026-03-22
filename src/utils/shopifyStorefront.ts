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
    fulllocation?: { value: string } | null;
    address?: { value: string } | null;
    time?: { value: string } | null;
    menu?: { value: string } | null;
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

export type MenuSection = {
  section: string;
  items: string[];
};

/**
 * Parses menu data in format:
 * Section: item1 | item2 | item3
 * Supports multiline string or JSON array of lines.
 */
export function parseMenuSections(value: string | null | undefined): MenuSection[] {
  if (!value?.trim()) return [];
  let lines: string[];
  try {
    const parsed = JSON.parse(value) as unknown;
    lines = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string').flatMap((s) => s.split('\n'))
      : value.split('\n');
  } catch {
    lines = value.split('\n');
  }
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(': ');
      if (colonIndex === -1) {
        return { section: 'Menu', items: [line] };
      }
      const section = line.slice(0, colonIndex).trim();
      const itemsStr = line.slice(colonIndex + 2).trim();
      const items = itemsStr.split('|').map((s) => s.trim()).filter(Boolean);
      return { section, items };
    })
    .filter((m) => m.items.length > 0);
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
          fulllocation: metafield(namespace: "custom", key: "fulllocation") {
            value
          }
          address: metafield(namespace: "custom", key: "address") {
            value
          }
          time: metafield(namespace: "custom", key: "time") {
            value
          }
          menu: metafield(namespace: "custom", key: "menu") {
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
          fulllocation?: { value: string } | null;
          address?: { value: string } | null;
          time?: { value: string } | null;
          menu?: { value: string } | null;
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
      fulllocation: product.fulllocation,
      address: product.address,
      time: product.time,
      menu: product.menu,
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
