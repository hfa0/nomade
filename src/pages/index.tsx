import type { NextPageWithLayout } from './_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import VisionSection from '@/components/VisionSection';
import HostSection from '@/components/HostSection';
import VisualBreakSection from '@/components/VisualBreakSection';
import BelieveSection from '@/components/BelieveSection';
import ConceptSection from '@/components/ConceptSection';
import PartnersCTASection from '@/components/PartnersCTASection';
import FollowUs from '@/components/FollowUs';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>NOMADE. PRESTIGE — Cultural Luxury Platform · Düsseldorf</title>
        <meta name="description" content="NOMADE. PRESTIGE — Die kulturelle Luxusplattform für Düsseldorf. Wo High Fashion, orientalisches Erbe und zeitgenössische Ästhetik zu unvergesslichen Momenten verschmelzen." />
      </Head>

      <HeroSection />
      <HostSection />
      <VisionSection />
      <VisualBreakSection />
      <BelieveSection />
      <FollowUs />
      <ConceptSection />
      <PartnersCTASection />
    </>
  );
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Home;
