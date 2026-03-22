/**
 * Fetches bookable events from Shopify for static generation.
 * Used in getStaticProps on /book and /book/[eventId].
 */
import type { BookableEvent } from '@/constants/events';
import { fetchShopifyProducts, parseMenuSections, type ShopifyProduct } from './shopifyStorefront';

function mapProductToEvent(product: ShopifyProduct): BookableEvent {
  const variants = product.variants ?? [];
  const ticketTiers = variants.map((v) => ({
    id: v.id,
    name: v.title,
    price: parseFloat(v.price),
    shopifyVariantId: v.legacyResourceId,
    benefits: v.benefits,
    soldOut: !v.availableForSale,
  }));
  const soldOut = ticketTiers.length > 0 && ticketTiers.every((t) => t.soldOut);

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    date: product.metafields?.time?.value ?? '—',
    location: product.metafields?.location?.value ?? 'Düsseldorf',
    fulllocation: product.metafields?.fulllocation?.value ?? null,
    address: product.metafields?.address?.value ?? null,
    menu: parseMenuSections(product.metafields?.menu?.value),
    description: product.description ?? null,
    image: product.featuredImage?.url ?? null,
    ticketTiers,
    soldOut,
  };
}

export async function fetchBookableEvents(): Promise<BookableEvent[]> {
  const products = await fetchShopifyProducts();
  return products.filter((p) => (p.variants?.length ?? 0) > 0).map(mapProductToEvent);
}
