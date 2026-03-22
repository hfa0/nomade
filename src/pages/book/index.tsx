import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { ROUTER } from '@/constants/router';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import type { BookableEvent } from '@/constants/events';
import { fetchBookableEvents } from '@/utils/bookableEvents';
import TicketIcon from '@/assets/svg/ticket.svg';

type Props = { events: BookableEvent[] };

export async function getStaticProps() {
  const events = await fetchBookableEvents();
  return { props: { events } };
}

const BookIndex: NextPageWithLayout<Props> = ({ events: staticEvents = [] }) => {
  const { data: events = staticEvents } = useQuery({
    queryKey: ['bookable-events-availability'],
    queryFn: fetchBookableEvents,
    initialData: staticEvents,
    staleTime: 60 * 1000,
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
                    className={`block w-full flex gap-4 p-0 overflow-hidden text-left rounded-lg border-2 transition-all group ${
                      event.soldOut
                        ? 'border-gray-200 opacity-75 hover:opacity-90'
                        : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                    }`}
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
                        {event.soldOut && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-white bg-gray-800 rounded">
                              Sold out
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 py-4 pr-4 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-primary font-medium uppercase tracking-widest text-xs">
                          {event.date} · {event.location}
                        </p>
                        {event.soldOut && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                            Sold out
                          </span>
                        )}
                      </div>
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
