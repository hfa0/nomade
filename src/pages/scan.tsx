import type { NextPageWithLayout } from './_app';
import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProducts, type ShopifyProduct } from '@/utils/shopifyStorefront';

const PATRON_PASSWORD = 'patron777';

const Scan: NextPageWithLayout = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [lastResult, setLastResult] = useState<{
    valid: boolean;
    ticketNumber?: string;
    orderNumber?: number;
    eventName?: string;
    productName?: string;
    variantTitle?: string | null;
    validatedAt?: string;
    validatedMoreThan2MinAgo?: boolean;
    items?: Array<{ productName?: string; variantTitle?: string | null }>;
    error?: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['shopify-products-scan'],
    queryFn: () => fetchShopifyProducts(),
    enabled: authenticated,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password === PATRON_PASSWORD) {
      setAuthenticated(true);
      setPassword('');
    } else {
      setError('Invalid password');
    }
  };

  const validateTicket = useCallback(async (ticketNumber: string) => {
    try {
      const res = await fetch(
        `/api/validate-ticket?ticketNumber=${encodeURIComponent(ticketNumber)}`,
      );
      const data = await res.json();
      const result = {
        valid: data.valid ?? false,
        ticketNumber: data.ticketNumber,
        orderNumber: data.orderNumber,
        eventName: data.eventName,
        productName: data.productName,
        variantTitle: data.variantTitle,
        validatedAt: data.validatedAt,
        validatedMoreThan2MinAgo: data.validatedMoreThan2MinAgo,
        items: data.items,
        error: data.error ?? (!data.valid ? 'Invalid QR code' : undefined),
      };
      setLastResult(result);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch (err: any) {
      setLastResult({ valid: false, error: err.message || 'Invalid QR code' });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, []);

  useEffect(() => {
    if (!authenticated || !isScanning || !scannerRef.current) return;

    const initScanner = async () => {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('scan-qr-reader');

      html5QrCodeRef.current = html5QrCode;

      const qrboxSize = Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 32 : 250);
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: qrboxSize, height: qrboxSize } },
        (decodedText: string) => {
          const digits = decodedText.trim().replace(/\D/g, '');
          const ticketNumber = digits.length >= 12 ? digits.slice(0, 12) : digits;
          if (ticketNumber.length === 12) {
            html5QrCode.stop();
            setIsScanning(false);
            validateTicket(ticketNumber);
          }
        },
        () => {},
      );
    };

    initScanner();

    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop();
      }
      html5QrCodeRef.current = null;
    };
  }, [authenticated, isScanning, validateTicket]);

  const startScanning = () => {
    setLastResult(null);
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current?.isScanning) {
      html5QrCodeRef.current.stop();
    }
    setIsScanning(false);
    html5QrCodeRef.current = null;
  };

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Scan — NOMADE. PRESTIGE</title>
          <meta name="robots" content="noindex" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
          <meta name="theme-color" content="#f5ebdd" />
        </Head>
        <div className="min-h-[100dvh] bg-light flex items-center justify-center p-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm space-y-4"
          >
            <h1 className="text-xl font-bold text-primary text-center">
              Scan
            </h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-4 text-base border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-4 min-h-[48px] bg-primary text-white font-semibold rounded-lg active:opacity-90 transition touch-manipulation"
            >
              Enter
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Scan — NOMADE. PRESTIGE</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#f5ebdd" />
      </Head>
      <div className="min-h-[100dvh] bg-light flex flex-col items-center p-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        <h1 className="text-xl font-bold text-primary mb-3">
          Scan
        </h1>

        {!selectedProduct ? (
          <div className="w-full max-w-md flex-1 flex flex-col min-h-0">
            <p className="text-sm text-gray-600 text-center mb-3">
              Select the event to scan tickets for
            </p>
            {productsLoading ? (
              <p className="text-center text-gray-500 py-8">Loading products…</p>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto -mx-1 px-1">
                {products
                  .filter((p) => p.variants?.some((v) => v.availableForSale))
                  .map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="w-full p-4 min-h-[56px] text-left rounded-lg border-2 border-primary/30 active:border-primary active:bg-primary/5 transition touch-manipulation"
                    >
                      <p className="font-semibold text-primary">{product.title}</p>
                      {product.metafields?.time?.value && (
                        <p className="text-xs text-gray-500 mt-1">
                          {product.metafields.time.value}
                          {product.metafields?.location?.value &&
                            ` · ${product.metafields.location.value}`}
                        </p>
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ) : !isScanning ? (
          <div className="w-full max-w-md space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="font-semibold text-primary">{selectedProduct.title}</p>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-sm text-gray-600 active:text-primary mt-1 min-h-[44px] touch-manipulation"
              >
                Change event
              </button>
            </div>
            <button
              onClick={startScanning}
              className="w-full px-6 py-4 min-h-[52px] bg-primary text-white font-semibold rounded-lg active:opacity-90 transition touch-manipulation"
            >
              Scan QR Code
            </button>
          </div>
        ) : (
          <>
            <div
              id="scan-qr-reader"
              ref={scannerRef}
              className="w-full max-w-full rounded-lg overflow-hidden mb-4"
            />
            <button
              onClick={stopScanning}
              className="w-full max-w-md px-6 py-4 min-h-[52px] border-2 border-primary text-primary font-semibold rounded-lg active:bg-primary/5 transition mb-4 touch-manipulation"
            >
              Stop
            </button>
          </>
        )}

        {selectedProduct && (
          <p className="text-xs text-gray-500 mt-2">
            Scanning for: {selectedProduct.title}
          </p>
        )}

        {lastResult && (
          <div
            ref={resultRef}
            className={classNames(
              'w-full max-w-md p-5 rounded-xl border-2 text-center',
              lastResult.valid
                ? lastResult.validatedMoreThan2MinAgo
                  ? 'bg-amber-50 border-amber-500 text-amber-900'
                  : 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800',
            )}
          >
            {lastResult.valid ? (
              <>
                <p className="text-2xl font-bold mb-2">✓ Valid Ticket</p>
                <p className="text-lg">#{lastResult.ticketNumber}</p>
                {lastResult.productName && (
                  <p className="text-lg mt-2 font-semibold">{lastResult.productName}</p>
                )}
                {lastResult.variantTitle && (
                  <p className="text-base opacity-80">{lastResult.variantTitle}</p>
                )}
                {lastResult.validatedAt && (
                  <p className="text-xs mt-3 opacity-70">
                    First validated: {new Date(lastResult.validatedAt).toLocaleString('de-DE')}
                  </p>
                )}
                {lastResult.validatedMoreThan2MinAgo && (
                  <p className="text-sm mt-2 font-semibold text-amber-700">
                    ⚠ Already validated more than 2 min ago
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl font-bold mb-2">✗ Invalid</p>
                <p className="text-sm">{lastResult.error || 'Invalid QR code'}</p>
              </>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-6">
          {selectedProduct && (
            <button
              onClick={() => {
                if (html5QrCodeRef.current?.isScanning) {
                  html5QrCodeRef.current.stop();
                  html5QrCodeRef.current = null;
                }
                setIsScanning(false);
                setSelectedProduct(null);
              }}
              className="text-sm text-gray-500 active:text-gray-700 min-h-[44px] flex items-center touch-manipulation"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setAuthenticated(false);
            }}
            className="text-sm text-gray-500 active:text-gray-700 min-h-[44px] flex items-center touch-manipulation"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
};

Scan.getLayout = (page) => <>{page}</>;

export default Scan;
