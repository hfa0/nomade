import Link from 'next/link';
import InViewAnimation from '@/components/InViewAnimation';
import { ROUTER } from '@/constants/router';

export default function PartnersCTASection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-primary text-light">
      <InViewAnimation className="max-w-2xl mx-auto text-center space-y-16">
        <h2 className="font-cooper text-4xl md:text-5xl font-medium uppercase mb-6 bg-light text-primary py-2">
          Partner With Us
        </h2>
        <p className="text-light/90 mb-10 text-lg">
          Align your brand with a discerning audience. NOMADE. PRESTIGE delivers premium visibility in an environment built for excellence.
        </p>
        <Link
          href={ROUTER.partners.href}
          className="inline-block px-10 py-4 bg-light text-primary font-medium uppercase tracking-widest text-sm hover:bg-white transition-colors"
        >
          Explore partnership
        </Link>
      </InViewAnimation>
    </section>
  );
}
