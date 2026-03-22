import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { TypeAnimation } from 'react-type-animation';
import { ROUTER } from '@/constants/router';
import hero from '@/assets/img/hero.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center bg-primary text-light px-6 py-24">
      <div className="absolute inset-0 opacity-30">
        <Image
          src={hero}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-10 text-center space-y-8 max-w-2xl p-6 rounded-lg">
        <h1 className="font-cooper text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-primary bg-light p-4 min-h-[1.2em] w-[min(100%,40rem)] mx-auto whitespace-nowrap">
          <TypeAnimation
            sequence={['NOMADE. PRESTIGE', 3000]}
            wrapper="span"
            speed={50}
            repeat={0}
            cursor={false}
            className="inline-block"
          />
        </h1>
      
        <motion.div
          className="pt-6 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link
            href={ROUTER.book.href}
            className="inline-block px-8 py-3 bg-light text-primary font-medium uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Buy ticket
          </Link>
          <Link
            href={ROUTER.gallery.href}
            className="inline-block px-8 py-3 border-2 border-light text-light font-medium uppercase tracking-widest text-sm hover:bg-light hover:text-primary transition-colors"
          >
            View gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
