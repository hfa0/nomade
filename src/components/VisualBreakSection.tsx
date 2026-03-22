import Image from 'next/image';
import ScrollBar from '@/components/ScrollBar';
import anotonio from '@/assets/img/brands/anotonio.png';
import babor from '@/assets/img/brands/babor.png';
import fachingen from '@/assets/img/brands/fachingen.png';
import itsyou from '@/assets/img/brands/itsyou.png';
import sinalco from '@/assets/img/brands/sinalco.png';
import xa from '@/assets/img/brands/xa.png';

const BRAND_IMAGES = [
  { src: anotonio, alt: 'Antonio' },
  { src: babor, alt: 'Babor' },
  { src: fachingen, alt: 'Fachingen' },
  { src: itsyou, alt: "It's You" },
  { src: sinalco, alt: 'Sinalco' },
  { src: xa, alt: 'XA' },
];

export default function VisualBreakSection() {
  return (
    <section className="relative bg-primary ">
    
      <ScrollBar className="py-10 md:py-6" duplicate={4}>
        {BRAND_IMAGES.map((brand, i) => (
          <div key={i} className="relative h-12 md:h-16 w-24 md:w-32 shrink-0 flex items-center">
            <Image
              src={brand.src}
              alt={brand.alt}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </ScrollBar>
    </section>
  );
}
