/**
 * Future events with ticket tiers for the Book page.
 * Each ticket tier must have a Shopify variant ID from your store.
 * Find variant IDs in Shopify Admin → Products → [Product] → Variants (in URL or API).
 */
export type TicketTier = {
  id: string;
  name: string;
  price: number;
  shopifyVariantId: string;
  benefits?: string[];
};

export type BookableEvent = {
  id: string;
  handle: string;
  name: string;
  date: string;
  location: string;
  description?: string | null;
  image?: string | null;
  ticketTiers: TicketTier[];
};

export const BOOKABLE_EVENTS: BookableEvent[] = [
  {
    id: 'nomade-vol-2',
    handle: 'nomade-vol-2',
    name: 'NOMADE. PRESTIGE Vol. 2',
    date: 'April 2025',
    location: 'Düsseldorf',
    ticketTiers: [
      { id: 'standard', name: 'Standard', price: 49, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
      { id: 'vip', name: 'VIP', price: 99, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
      { id: 'table', name: 'Reserved Table', price: 299, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
    ],
  },
  {
    id: 'nomade-vol-3',
    handle: 'nomade-vol-3',
    name: 'NOMADE. PRESTIGE Vol. 3',
    date: 'June 2025',
    location: 'Düsseldorf',
    ticketTiers: [
      { id: 'standard', name: 'Standard', price: 49, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
      { id: 'vip', name: 'VIP', price: 99, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
    ],
  },
  {
    id: 'nomade-special',
    handle: 'nomade-special',
    name: 'NOMADE. PRESTIGE — Special Edition',
    date: 'Coming Soon',
    location: 'Düsseldorf',
    ticketTiers: [
      { id: 'early-bird', name: 'Early Bird', price: 39, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
      { id: 'standard', name: 'Standard', price: 59, shopifyVariantId: 'REPLACE_WITH_VARIANT_ID' },
    ],
  },
];
