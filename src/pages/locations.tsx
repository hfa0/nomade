import type { NextPageWithLayout } from './_app';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import MainLayout from '@/layouts/MainLayout';
import InViewAnimation from '@/components/InViewAnimation';
import { ImageFullView } from '@itsyouagency/ui';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

type LocationGroup = {
  slug: string;
  name: string;
  images: { src: string; alt: string }[];
};

type Props = {
  locations: LocationGroup[];
};

function loadLocationsFromStatic(): LocationGroup[] {
  const staticPath = join(process.cwd(), 'static', 'locations');
  if (!existsSync(staticPath)) return [];

  const slugs = readdirSync(staticPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  return slugs.map((slug) => {
    const dirPath = join(staticPath, slug);
    const dataPath = join(dirPath, 'data.json');
    let name = slug;

    if (existsSync(dataPath)) {
      try {
        const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
        name = data.name ?? name;
      } catch {
        // use slug as name
      }
    }

    const files = readdirSync(dirPath)
      .filter((f) => IMAGE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
      .sort();

    const images = files.map((filename) => ({
      src: `/locations/${slug}/${filename}`,
      alt: `${name} — ${filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}`,
    }));

    return { slug, name, images };
  }).filter((loc) => loc.images.length > 0);
}

export const getStaticProps: GetStaticProps<Props> = () => {
  const locations = loadLocationsFromStatic();
  return { props: { locations } };
};

const Locations: NextPageWithLayout<Props> = ({ locations }) => {
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Head>
        <title>Locations — NOMADE. PRESTIGE</title>
        <meta name="description" content="Discover our venues — curated visuals from NOMADE. PRESTIGE events across Düsseldorf and beyond." />
      </Head>

      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-8xl mx-auto">
          <h1 className="font-cooper text-primary text-4xl md:text-5xl font-bold uppercase text-center mb-4">
            Locations
          </h1>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-16">
            A visual journey through our venues — where runway, art and community converge.
          </p>

          {locations.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No locations yet.</p>
          ) : (
            <div className="space-y-16">
              {locations.map((group) => (
                <InViewAnimation key={group.slug}>
                  <h2 className="font-cooper text-primary text-2xl md:text-3xl font-bold uppercase mb-6 border-b-2 border-primary/20 pb-3">
                    {group.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.images.map(({ src, alt }) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setFullscreenImage({ src, alt })}
                        className="relative aspect-[4/5] overflow-hidden group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </InViewAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {fullscreenImage && (
        <ImageFullView
          imageUrl={fullscreenImage.src}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </>
  );
};

Locations.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Locations;
