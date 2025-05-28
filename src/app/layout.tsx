import "@/app/globals.css"
import React from "react";
import { QueryProviders } from "@/lib/QueryProviders";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
    <head>
      <title>주식 시뮬레이터</title>
      <meta name="description" content="알고리즘 기반 주식 시뮬레이터" />
    </head>
    <body>
    <QueryProviders>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </QueryProviders>
    </body>
    </html>
  );
}
