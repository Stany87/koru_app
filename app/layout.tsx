import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const StarryBackground = dynamic(() => import("@/components/starry-background"), { ssr: false })

export const metadata: Metadata = {
  title: "Koru - Mental Wellness App",
  description: "A comprehensive mental wellness application for personal growth and mental health support",
  keywords: "mental health, wellness, meditation, journaling, AI companion, mindfulness",
  authors: [{ name: "Koru Team" }],
  creator: "Koru",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Koru",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Koru" />
        <link rel="apple-touch-icon" href="/koru_logo.png" />
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        )}
      </head>
             <body>
               <StarryBackground />
               <Suspense fallback={<div>Loading...</div>}>
                 <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
               </Suspense>
             </body>
    </html>
  )
}
