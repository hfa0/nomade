import Image from 'next/image';
import InViewAnimation from '@/components/InViewAnimation';
import itsyouLogo from '@/assets/img/brands/itsyou.png';
import xaLogo from '@/assets/img/brands/xa.png';

export default function HostSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-primary text-light">
      <div className="max-w-3xl mx-auto">
        <InViewAnimation className="text-center space-y-10">
          <h2 className="font-cooper text-4xl md:text-5xl font-medium uppercase text-light">
            Host
          </h2>
          <div className="space-y-6">
            <p className="text-light/95 text-lg leading-relaxed">
              NOMADE. PRESTIGE is proudly hosted by IT'S You Agency and Xatuna Amoyan — two forces at the intersection of culture, identity, and elevated experiences.
            </p>
            <p className="text-light/80 text-base italic">
              Together we create spaces where heritage meets the future, and community finds its stage.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 pt-6">
            <div className="relative h-14 w-36 md:h-16 md:w-44 shrink-0 [&_img]:brightness-0 [&_img]:invert">
              <Image
                src={itsyouLogo}
                alt="I.T.S You Agency"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-16 w-32 md:h-20 md:w-40 shrink-0 [&_img]:brightness-0 [&_img]:invert">
              <Image
                src={xaLogo}
                alt="XA"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </InViewAnimation>
      </div>
    </section>
  );
}
