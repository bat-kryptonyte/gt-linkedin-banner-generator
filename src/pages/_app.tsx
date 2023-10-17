import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import theme from '@/utils/theme';

import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
