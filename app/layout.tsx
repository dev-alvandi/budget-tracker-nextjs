import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Analysis",
  description: "A budget analysis app build on Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider data-testid="clerk-provider">
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: "dark",
        }}
        suppressHydrationWarning
      >
        <body className={inter.className}>
          <Toaster
            richColors
            position="bottom-right"
            data-testid="toaster-component"
          />
          <RootProviders data-testid="root-providers">{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
