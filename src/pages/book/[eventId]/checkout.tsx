import type { NextPageWithLayout } from '../../_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import type { BookableEvent, TicketTier } from '@/constants/events';
import { buildShopifyCheckoutUrl } from '@/utils/shopify';
import { fetchShopifyProducts, type ShopifyProduct } from '@/utils/shopifyStorefront';
import TicketIcon from '@/assets/svg/ticket.svg';

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE || '';

function mapProductToEvent(product: ShopifyProduct): BookableEvent {
  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    date: product.metafields?.time?.value ?? '—',
    location: product.metafields?.location?.value ?? 'Düsseldorf',
    description: product.description ?? null,
    image: product.featuredImage?.url ?? null,
    ticketTiers: product.variants
      .filter((v) => v.availableForSale)
      .map((v) => ({
        id: v.id,
        name: v.title,
        price: parseFloat(v.price),
        shopifyVariantId: v.legacyResourceId,
        benefits: v.benefits,
      })),
  };
}

async function fetchEvents(): Promise<BookableEvent[]> {
  const products = await fetchShopifyProducts();
  return products
    .filter((p) => p.variants?.some((v) => v.availableForSale))
    .map(mapProductToEvent);
}

type FormData = {
  name: string;
  email: string;
};

const BookCheckout: NextPageWithLayout = () => {
  const router = useRouter();
  const { eventId, variant } = router.query;

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: fetchEvents,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const variantId = typeof variant === 'string' ? variant : Array.isArray(variant) ? variant[0] : undefined;
  const selectedEvent = events.find((e) => e.handle === eventId);
  const selectedTier = selectedEvent?.ticketTiers.find(
    (t) => t.shopifyVariantId === variantId || t.id === variantId
  );

  const onSubmit = async (data: FormData) => {
    if (!selectedTier || !SHOPIFY_STORE) return;

    const url = buildShopifyCheckoutUrl(SHOPIFY_STORE, selectedTier.shopifyVariantId, 1, {
      email: data.email,
    });
    window.location.href = url;
  };

  if (!router.isReady || isLoading) {
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center py-12 text-gray-500">
          Loading…
        </div>
      </section>
    );
  }

  if (error || !selectedEvent || !selectedTier || !variantId) {
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600 mb-4">Invalid checkout. Please select a ticket.</p>
          <Link href={selectedEvent ? `/book/${selectedEvent.handle}` : '/book'} className="text-primary hover:underline">
            ← Back
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout — {selectedEvent.name} — NOMADE. PRESTIGE</title>
        <meta name="description" content={`Complete your booking for ${selectedEvent.name} at NOMADE. PRESTIGE.`} />
      </Head>

      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6 overflow-x-hidden">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/book/${selectedEvent.handle}`}
            className="text-sm text-gray-500 hover:text-primary mb-4 inline-block"
          >
            ← Back to tickets
          </Link>

          <div className="mb-6 p-6 rounded-xl border-2 border-primary/20 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <TicketIcon className="w-5 h-5 text-primary shrink-0" aria-hidden />
              <p className="text-xs uppercase tracking-widest text-gray-500">{selectedEvent.name}</p>
            </div>
            <p className="font-cooper text-xl font-bold text-primary mt-1">
              {selectedTier.name} — €{selectedTier.price}
            </p>
            {selectedTier.benefits && selectedTier.benefits.length > 0 && (
              <ul className="mt-3 space-y-2">
                {selectedTier.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail *
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email',
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-light font-medium uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Redirecting…' : 'Proceed to checkout'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-xs mt-4">
            You will be redirected to our secure Shopify checkout to complete payment.
          </p>
        </div>
      </section>
    </>
  );
};

BookCheckout.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookCheckout;
