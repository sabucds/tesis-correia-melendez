import React from 'react';
import NProgress from 'nprogress';
import Router, { useRouter, withRouter } from 'next/router';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContextProvider, UserContextProvider } from '../context';
import { useApollo } from '../hooks';
import '../style.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// a

// @ts-expect-error err is not defined
function MyApp({ Component, pageProps, err }: AppProps<any>) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const queryClient = new QueryClient();
  React.useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });

    Router.events.on('routeChangeError', () => {
      NProgress.done();
    });
  }, []);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // On page load or when changing themes, best to add inline in `head` to avoid FOUC
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Whenever the user explicitly chooses light mode
      localStorage.theme = 'light';

      // Whenever the user explicitly chooses dark mode
      localStorage.theme = 'dark';

      // Whenever the user explicitly chooses to respect the OS preference
      localStorage.removeItem('theme');
    }
  }, []);

  const router = useRouter();
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <ApolloProvider client={apolloClient}>
        <>
          <Head>
            <title>OPTIdecide</title>
            <link rel="icon" href="/LogoOptidecide.ico" />
          </Head>
          <QueryClientProvider client={queryClient}>
            <ToastContextProvider>
              <UserContextProvider>
                {router.pathname === '/sign-in' ||
                router.pathname === '/sign-up' ||
                router.pathname === '/forgot-password' ||
                router.pathname === '/reset-password/[token]' ||
                router.pathname === '/reset-password/confirmation' ? null : (
                  <Navbar />
                )}
                <Component {...pageProps} err={err} />
                {router.pathname === '/sign-in' ||
                router.pathname === '/sign-up' ||
                router.pathname === '/forgot-password' ||
                router.pathname === '/reset-password/[token]' ||
                router.pathname === '/reset-password/confirmation' ? null : (
                  <Footer />
                )}
              </UserContextProvider>
            </ToastContextProvider>
          </QueryClientProvider>
        </>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default withRouter(MyApp);
