import type { NextPageWithLayout } from './_app';
import Head from 'next/head';
import Image from 'next/image';
import MainLayout from '@/layouts/MainLayout';

const GALLERY_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Runway' },
  { id: 2, src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', alt: 'Fashion' },
  { id: 3, src: 'https://images.unsplash.com/photo-1509631179647-843733944435?w=800&q=80', alt: 'Event' },
  { id: 4, src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Crowd' },
  { id: 5, src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', alt: 'Culture' },
  { id: 6, src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80', alt: 'Party' },
  { id: 7, src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', alt: 'Concert' },
  { id: 8, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Portrait' },
  { id: 9, src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80', alt: 'Style' },
];

const Gallery: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Gallery — NOMADE. PRESTIGE</title>
        <meta name="description" content="Moments from NOMADE. PRESTIGE — curated visuals from our runway shows, art installations and community gatherings in Düsseldorf." />
      </Head>

      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-8xl mx-auto">
          <h1 className="font-cooper text-primary text-4xl md:text-5xl font-bold uppercase text-center mb-4">
            Gallery
          </h1>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-16">
            A visual journey through our events — where runway, art and community converge.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_IMAGES.map(({ id, src, alt }) => (
              <div key={id} className="relative aspect-[4/5] overflow-hidden group">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

Gallery.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Gallery;
