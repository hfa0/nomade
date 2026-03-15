import '@itsyouagency/ui/dist/assets/css/globals.css';
import '@itsyouagency/ui/dist/assets/css/fonts.css';
import '../assets/css/globals.css';
import '../assets/css/cooper.css';
import { NextPage } from 'next';
import { ReactElement, ReactNode, useEffect } from 'react';
import { AppProps } from 'next/app';
import moment from 'moment';
import 'moment/locale/de';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from '@itsyouagency/ui';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type NextPageWithLayout<P = Record<any, any>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement, props?: any) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const queryClient = new QueryClient();

  useEffect(() => {
    moment.locale(navigator.language);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </QueryClientProvider>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
    </>
  );
}
