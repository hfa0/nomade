/**
 * Build Shopify cart permalink that redirects to checkout.
 * Format: https://{store}.myshopify.com/cart/{variant_id}:{quantity}
 * By default, Shopify redirects to checkout after adding to cart.
 * @see https://help.shopify.com/en/manual/checkout-settings/cart-permalink
 */
export function buildShopifyCheckoutUrl(
  storeDomain: string,
  variantId: string,
  quantity: number = 1,
  options?: { email?: string }
): string {
  const base = `https://${storeDomain}/cart/${variantId}:${quantity}`;
  const params = new URLSearchParams();
  if (options?.email) {
    params.set('checkout[email]', options.email);
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
