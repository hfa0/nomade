import Image from 'next/image';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import bg from '@/assets/img/bg.jpg';

export default function VisualBreakSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <section ref={ref} className="relative h-[50vh] min-h-[320px]">
      <Image
        src={bg}
        alt=""
        fill
        className="object-cover"
      />
      <motion.div
        className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="font-cooper text-light text-2xl md:text-4xl font-bold uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Fashion · Art · Music
        </motion.p>
      </motion.div>
    </section>
  );
}
