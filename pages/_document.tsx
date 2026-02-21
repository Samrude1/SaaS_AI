import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>MeetingMind Pro — AI-Powered Meeting Assistant</title>
        <meta name="description" content="AI-powered meeting consultation and action item generation" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

