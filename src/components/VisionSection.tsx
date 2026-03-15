import Image from 'next/image';
import InViewAnimation from '@/components/InViewAnimation';
import vision1 from '@/assets/img/vision/D7408428 1.png';
import vision2 from '@/assets/img/vision/D7409037 1.png';
import vision3 from '@/assets/img/vision/D7409130 1.png';
import vision4 from '@/assets/img/vision/D7408490 1.png';

const VISION_IMAGES = [
  { src: vision1, alt: 'NOMADE. PRESTIGE vision' },
  { src: vision2, alt: 'NOMADE. PRESTIGE vision' },
  { src: vision3, alt: 'NOMADE. PRESTIGE vision' },
  { src: vision4, alt: 'NOMADE. PRESTIGE vision' },
];

export default function VisionSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-light">
      <div className="max-w-6xl mx-auto">
        <InViewAnimation className="text-center mb-16">
          <h2 className="font-cooper text-primary text-3xl md:text-4xl font-bold uppercase mb-4">
            Our Vision
          </h2>
          <p className="font-cooper text-primary text-2xl md:text-3xl font-bold mb-8">
            NOMADE. PRESTIGE
          </p>
          <p className="text-gray-700 text-lg mb-6">
            A cultural luxury platform where excellence meets intention.
          </p>
          <p className="text-gray-700 text-lg mb-10">
            We bring together High Fashion, oriental heritage and contemporary aesthetics — creating experiences that elevate Düsseldorf&apos;s cultural landscape.
          </p>
        </InViewAnimation>

        <InViewAnimation className="grid grid-cols-2 gap-3 md:gap-4 mb-16 max-w-2xl mx-auto">
          {VISION_IMAGES.map((img, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </InViewAnimation>

        <InViewAnimation className="max-w-3xl mx-auto text-center">
          <p className="font-cooper text-primary text-xl md:text-2xl font-bold mb-2">
            Runway. Art. Community.
          </p>
          <p className="text-gray-600 text-base mb-12">
            Curated with care. Crafted with purpose. Designed to inspire.
          </p>
          <blockquote className="text-gray-800 font-medium text-lg border-l-4 border-primary pl-6 italic text-left">
            &ldquo;What began as a vision has become a movement. Our inaugural NOMADE. PRESTIGE event sold out — a testament to the power of uniting fashion, culture and community.&rdquo;
          </blockquote>
        </InViewAnimation>
      </div>
    </section>
  );
}
