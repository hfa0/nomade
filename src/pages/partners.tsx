import type { NextPageWithLayout } from './_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import InViewAnimation from '@/components/InViewAnimation';
import VisualBreakSection from '@/components/VisualBreakSection';

const BENEFITS = [
  {
    title: 'A Discerning Audience',
    text: 'Young, fashion-forward individuals with a genuine appreciation for culture, lifestyle and high fashion — an audience that values quality and authenticity.',
  },
  {
    title: 'Proven Reach',
    text: 'Our inaugural NOMADE. PRESTIGE event sold out — a clear signal of demand and engagement from a community that shows up.',
  },
  {
    title: 'Curated Context',
    text: 'Your brand positioned within an elevated environment — runway, art and community, where every touchpoint reflects excellence.',
  },
  {
    title: 'Düsseldorf & Beyond',
    text: 'Access to a sophisticated urban audience in one of Germany&apos;s leading fashion and culture capitals — with influence that extends far beyond.',
  },
];

const Partners: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Partners — NOMADE. PRESTIGE</title>
        <meta name="description" content="Partner with NOMADE. PRESTIGE — reach a discerning, fashion-forward audience in Düsseldorf and beyond." />
      </Head>

      {/* Hero */}
      <section className="relative pt-24 py-24 md:pt-28 md:py-32 px-6 bg-primary text-light">
        <div className="absolute inset-0 opacity-20">
    
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="font-cooper text-4xl md:text-5xl font-bold uppercase mb-6 text-light py-6">
            Partner With Us
          </h1>
          <p className="text-light/90 text-lg">
            NOMADE. PRESTIGE is the cultural luxury platform for Düsseldorf — connecting brands with a new generation at the intersection of heritage and high fashion.
          </p>
        </div>
      </section>

      {/* Brands */}
      <VisualBreakSection />

      {/* Benefits */}
      <section className="py-20 md:py-28 px-6 bg-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cooper text-primary text-2xl md:text-3xl font-bold uppercase text-center mb-16">
            Why NOMADE. PRESTIGE?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {BENEFITS.map((item, i) => (
              <div key={i} className="border-l-2 border-primary pl-8">
                <h3 className="font-cooper text-primary text-lg font-bold uppercase mb-3">
                  {item.title}
                </h3>
                <p className="text-dark/80 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 bg-primary text-light">
        <InViewAnimation className="max-w-2xl mx-auto text-center space-y-16">
          <h2 className="font-cooper text-3xl md:text-4xl font-bold uppercase mb-6 bg-light text-primary py-2">
            Get in Touch
          </h2>
          <p className="text-light/90 mb-10">
            For sponsorship packages, collaborations and brand partnerships — we&apos;d love to hear from you.
          </p>
          <a
            href="mailto:info@itsyouagency.net"
            className="inline-block px-10 py-4 bg-light text-primary font-medium uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            info@itsyouagency.net
          </a>
        </InViewAnimation>
      </section>
    </>
  );
};

Partners.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Partners;
