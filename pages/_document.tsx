import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased dark:bg-black dark:text-zinc-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

