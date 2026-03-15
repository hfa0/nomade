import Image from 'next/image';
import InViewAnimation from '@/components/InViewAnimation';
import luxuryImg from '@/assets/img/believe/D7408376 1.png';
import communityImg from '@/assets/img/believe/D7408654 1.png';

export default function BelieveSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-light">
      <div className="max-w-4xl mx-auto">
        <InViewAnimation>
          <h2 className="font-cooper text-primary text-3xl md:text-4xl font-bold uppercase text-center mb-16">
            What We Believe
          </h2>
          <p className="text-gray-700 text-lg text-center mb-16 italic">
            The nomad spirit lives in those who adapt, create and shape culture — carrying forward the stories of our ancestors while forging new paths.
          </p>
        </InViewAnimation>
        <InViewAnimation className="grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
              <Image
                src={luxuryImg}
                alt="Cultural Luxury"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h3 className="font-cooper text-primary text-xl font-bold uppercase mb-3">
              Cultural Luxury
            </h3>
            <p className="text-gray-700 italic">Luxury rooted in identity and depth — never superficial, always meaningful.</p>
          </div>
          <div className="text-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
              <Image
                src={communityImg}
                alt="Community"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h3 className="font-cooper text-primary text-xl font-bold uppercase mb-3">
              Community
            </h3>
            <p className="text-gray-700 italic">A new generation at the intersection of heritage and high fashion — bold, discerning, connected.</p>
          </div>
        </InViewAnimation>
      </div>
    </section>
  );
}
