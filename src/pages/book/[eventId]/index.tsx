import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextPageWithLayout } from '../../_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@itsyouagency/ui';
import type { BookableEvent, TicketTier } from '@/constants/events';
import { buildShopifyCheckoutUrl } from '@/utils/shopify';
import { fetchBookableEvents } from '@/utils/bookableEvents';
import TicketIcon from '@/assets/svg/ticket.svg';
import LocationMap from '@/components/LocationMap';

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE || '';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

type FormData = { name: string; email: string };

type Props = { events: BookableEvent[]; selectedEvent: BookableEvent | null };

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await fetchBookableEvents();
  return {
    paths: events.map((e) => ({ params: { eventId: e.handle } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const eventId = params?.eventId as string;
  const events = await fetchBookableEvents();
  const selectedEvent = events.find((e) => e.handle === eventId) ?? null;
  return { props: { events, selectedEvent } };
};

const BookEventTickets: NextPageWithLayout<Props> = ({ selectedEvent: staticEvent }) => {
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);

  const { data: events = [] } = useQuery({
    queryKey: ['bookable-events-availability'],
    queryFn: fetchBookableEvents,
    staleTime: 60 * 1000,
  });

  const selectedEvent = useMemo(() => {
    if (!staticEvent) return null;
    const fresh = events.find((e) => e.handle === staticEvent.handle);
    return fresh ?? staticEvent;
  }, [staticEvent, events]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const closeSidebar = useCallback(() => setSelectedTier(null), []);

  if (!staticEvent || !selectedEvent) {
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600">Event not found.</p>
        </div>
      </section>
    );
  }

  const selectTier = (tier: TicketTier) => {
    if (tier.soldOut) return;
    setSelectedTier(tier);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedTier || selectedTier.soldOut || !SHOPIFY_STORE) return;
    const url = buildShopifyCheckoutUrl(SHOPIFY_STORE, selectedTier.shopifyVariantId, 1, {
      email: data.email,
    });
    window.location.href = url;
  };

  return (
    <>
      <Head>
        <title>{selectedEvent.name} — Book — NOMADE. PRESTIGE</title>
        <meta name="description" content={`Book tickets for ${selectedEvent.name} at NOMADE. PRESTIGE.`} />
      </Head>

      <section className="pt-0 pb-16 md:pb-24 px-6 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {selectedEvent.image && (
            <div className="relative aspect-[5/2] w-screen max-w-none left-1/2 -translate-x-1/2 rounded-none mb-8 overflow-hidden">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.name}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-light/90">
                <div className="max-w-5xl mx-auto px-6 py-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    {selectedEvent.date} · {selectedEvent.location}
                  </p>
                  <h2 className="font-cooper text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                    {selectedEvent.name}
                  </h2>
                </div>
              </div>
            </div>
          )}

          {selectedEvent.description && (
            <div className="mb-8">
              <p className="text-gray-600 text-sm max-w-xl">
                {selectedEvent.description}
              </p>
            </div>
          )}

          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-4">
            Select ticket tier
          </h3>
          <div className="flex flex-row gap-4 overflow-x-auto pb-2 items-stretch">
            {selectedEvent.ticketTiers.map((tier, tierIndex) => {
              const hasLeftAccent = /basic|member|exclusive|premium|vip/i.test(tier.name);
              const isExclusive = /exclusive|premium|vip/i.test(tier.name);
              const isRecommended = /member/i.test(tier.name);
              const isSoldOut = tier.soldOut;
              const prevTierBenefits = tierIndex > 0
                ? (selectedEvent.ticketTiers[tierIndex - 1]?.benefits ?? [])
                : [];
              const isNewBenefit = (b: string) => tierIndex > 0 && !prevTierBenefits.includes(b);
              return (
                <div key={tier.id} className="flex flex-col w-[280px] min-w-[280px] shrink-0">
                  <div className="flex items-center justify-center py-3 text-primary">
                    <TicketIcon className="w-8 h-8" aria-hidden />
                  </div>
                  <button
                    type="button"
                    onClick={() => selectTier(tier)}
                    disabled={isSoldOut}
                    className={`relative flex-1 flex flex-col min-h-[320px] overflow-hidden rounded-xl border-2 transition-all duration-300 group text-left focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed ${
                    isSoldOut
                      ? 'border-gray-200/60 bg-transparent opacity-50'
                      : isExclusive
                        ? 'border-secondary bg-gradient-to-br from-secondary/15 to-secondary/5 shadow-lg shadow-secondary/10 hover:shadow-xl hover:shadow-secondary/15 hover:border-secondary/90'
                        : 'border-gray-200 bg-white hover:border-primary hover:shadow-md hover:shadow-primary/10'
                  }`}
                >
                  {hasLeftAccent && !isSoldOut && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isExclusive ? 'bg-secondary' : 'bg-primary'}`} aria-hidden />
                  )}
                  <div className={`flex flex-col h-full gap-4 ${hasLeftAccent ? 'p-6 pl-7' : 'p-6'}`}>
                    <div className="flex-1 min-w-0 min-h-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`font-cooper text-lg font-bold transition-colors ${
                          isSoldOut ? 'text-gray-500' : isExclusive ? 'text-secondary' : 'text-gray-900 group-hover:text-primary'
                        }`}>
                          {tier.name}
                        </span>
                        {isSoldOut && (
                          <span className="inline-flex items-center text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-md">
                            Sold out
                          </span>
                        )}
                        {!isSoldOut && isRecommended && (
                          <span className="inline-flex items-center text-[10px] uppercase tracking-[0.15em] font-semibold text-primary bg-primary/15 px-2.5 py-1 rounded-md">
                            Recommended
                          </span>
                        )}
                      </div>
                      {tier.benefits && tier.benefits.length > 0 && (
                        <ul className="space-y-2">
                          {tier.benefits.map((b, i) => {
                            const isNew = isNewBenefit(b);
                            return (
                              <li key={i} className={`flex items-center gap-3 text-sm ${hasLeftAccent ? 'text-gray-700' : 'text-gray-600'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isNew ? (isExclusive ? 'bg-secondary' : 'bg-primary') : 'bg-gray-300'}`} aria-hidden />
                                <span className={isNew ? 'font-semibold' : ''}>{b}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 mt-auto pt-4 border-t border-gray-200">
                      <span className={`font-cooper font-bold ${
                        isSoldOut ? 'text-gray-400 text-xl' : isExclusive ? 'text-secondary text-2xl' : hasLeftAccent ? 'text-primary text-2xl' : 'text-primary text-xl'
                      }`}>
                        €{tier.price} <span className="text-xs font-normal opacity-80">incl. MwSt</span>
                      </span>
                      <span className={`text-xs uppercase tracking-widest transition-colors ${
                        isSoldOut
                          ? 'text-gray-400'
                          : isExclusive ? 'text-secondary/80 group-hover:text-secondary' : hasLeftAccent ? 'text-primary/80 group-hover:text-primary' : 'text-gray-400 group-hover:text-primary'
                      }`}>
                        {isSoldOut ? 'Sold out' : 'Select →'}
                      </span>
                    </div>
                  </div>
                </button>
                </div>
              );
            })}
          </div>

          {(selectedEvent.fulllocation || (selectedEvent.menu && selectedEvent.menu.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mt-10 mb-8">
              {selectedEvent.menu && selectedEvent.menu.length > 0 && (
                <div className="flex items-start gap-3">
                  <Icon name="Dish" size={20} className="text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500 mb-3">Menu</p>
                    <div className="space-y-4">
                      {selectedEvent.menu.map((group, gi) => (
                        <div key={gi}>
                          <p className="text-sm font-semibold text-primary mb-1.5">{group.section}</p>
                          <ul className="space-y-1">
                            {group.items.map((item, ii) => (
                              <li key={ii} className="text-gray-700 text-sm flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" aria-hidden />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {selectedEvent.fulllocation && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Icon name="Marker" size={20} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500 mb-1">Location</p>
                      <p className="text-gray-700 text-sm">{selectedEvent.fulllocation}</p>
                    </div>
                  </div>
                  <LocationMap
                    apiKey={GOOGLE_MAPS_API_KEY}
                    className="rounded-lg overflow-hidden border border-gray-200"
                    height={200}
                    address={selectedEvent.address ?? selectedEvent.fulllocation}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Checkout sidebar */}
      <AnimatePresence>
        {selectedTier && selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeSidebar}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-light border-l border-gray-200 shadow-xl z-50 flex flex-col overflow-hidden"
              aria-modal
              aria-labelledby="checkout-sidebar-title"
            >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="checkout-sidebar-title" className="font-cooper text-lg font-bold text-primary">
                Checkout
              </h2>
              <button
                type="button"
                onClick={closeSidebar}
                className="p-2 -m-2 text-gray-500 hover:text-primary transition-colors"
                aria-label="Close"
              >
                <Icon name="Close" size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 p-6 rounded-xl border-2 border-primary/20 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <TicketIcon className="w-5 h-5 text-primary shrink-0" aria-hidden />
                  <p className="text-xs uppercase tracking-widest text-gray-500">{selectedEvent.name}</p>
                </div>
                <p className="font-cooper text-xl font-bold text-primary mt-1">
                  {selectedTier.name} — €{selectedTier.price} <span className="text-sm font-normal opacity-80">incl. MwSt</span>
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
                  <label htmlFor="sidebar-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    id="sidebar-name"
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
                  <label htmlFor="sidebar-email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail *
                  </label>
                  <input
                    id="sidebar-email"
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
          </motion.aside>
        </>
        )}
      </AnimatePresence>
    </>
  );
};

BookEventTickets.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookEventTickets;
