import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nomade-prestige.de';
const OG_IMAGE = `${SITE_URL}/card.jpg`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="NOMADE. PRESTIGE" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NOMADE. PRESTIGE — Cultural Luxury Platform · Düsseldorf" />
        <meta property="og:description" content="NOMADE. PRESTIGE is the cultural luxury platform for Düsseldorf. Where high fashion, oriental heritage and contemporary aesthetics merge into unforgettable moments. Tickets, events and exclusive experiences." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="NOMADE. PRESTIGE — Cultural Luxury Platform" />
        <meta property="og:site_name" content="NOMADE. PRESTIGE" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NOMADE. PRESTIGE — Cultural Luxury Platform · Düsseldorf" />
        <meta name="twitter:description" content="NOMADE. PRESTIGE is the cultural luxury platform for Düsseldorf. Where high fashion, oriental heritage and contemporary aesthetics merge into unforgettable moments. Tickets, events and exclusive experiences." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="NOMADE. PRESTIGE — Cultural Luxury Platform" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
