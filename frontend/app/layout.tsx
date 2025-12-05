import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Business",
  description: "WhatsApp Business Dashboard",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WA Business",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#10b981" />
          <link rel="apple-touch-icon" href="/icon-192.png" />
        </head>
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                      navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                          console.log('SW registered:', registration);
                        })
                        .catch((error) => {
                          console.log('SW registration failed:', error);
                        });
                    });
                  }
                `,
              }}
            />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
