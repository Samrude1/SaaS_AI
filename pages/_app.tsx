import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { AppProps } from 'next/app';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#6366f1',
        }
      }}
      {...pageProps}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}