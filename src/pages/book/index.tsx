import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { ROUTER } from '@/constants/router';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import type { BookableEvent } from '@/constants/events';
import { fetchShopifyProducts, type ShopifyProduct } from '@/utils/shopifyStorefront';
import TicketIcon from '@/assets/svg/ticket.svg';

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

const BookIndex: NextPageWithLayout = () => {
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: fetchEvents,
  });

  return (
    <>
      <Head>
        <title>Book — NOMADE. PRESTIGE</title>
        <meta name="description" content="Reserve your place at NOMADE. PRESTIGE — tickets, tables and exclusive experiences in Düsseldorf." />
      </Head>

      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6 overflow-x-hidden">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-cooper text-primary text-4xl md:text-5xl font-bold uppercase text-center mb-4">
            Book
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Select an event, choose your ticket, and complete your purchase via our secure checkout.
          </p>

          {isLoading && (
            <div className="text-center py-12 text-gray-500">
              Loading events…
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Could not load events. Please try again later.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gray-500 mb-4">
                <TicketIcon className="w-5 h-5 text-primary shrink-0" aria-hidden />
                Select event
              </h2>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                  <TicketIcon className="w-16 h-16 text-gray-300 mb-4" aria-hidden />
                  <p className="text-gray-500 text-center font-medium">No events available at the moment.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">Check back soon for upcoming experiences.</p>
                </div>
              ) : (
                events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/book/${event.handle}`}
                    className="block w-full flex gap-4 p-0 overflow-hidden text-left rounded-lg border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    {event.image && (
                      <div className="relative w-48 h-48 md:w-72 md:h-72 shrink-0">
                        <Image
                          src={event.image}
                          alt={event.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 192px, 288px"
                        />
                      </div>
                    )}
                    <div className="flex-1 py-4 pr-4 min-w-0">
                      <p className="text-primary font-medium uppercase tracking-widest text-xs mb-1">
                        {event.date} · {event.location}
                      </p>
                      <h3 className="font-cooper text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      {event.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          <p className="text-center text-gray-500 text-sm mt-12">
            For brand partnerships and advertising:{' '}
            <Link href={ROUTER.partners.href} className="text-primary hover:underline">
              Partners
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

BookIndex.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookIndex;
