import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link
          rel="icon"
          href="/images/logo-transparent-small.png"
          type="image/png"
          sizes="273x273"
        />
        <link
          rel="apple-touch-icon"
          href="/images/logo-transparent-small.png"
        />
        <meta name="theme-color" content="#14532d" />
        <meta name="application-name" content="Litoral Microverdes" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
