import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { registerServiceWorker } from '@/lib/registry/serviceWorkerRegistration'

const inter = Inter({ subsets: ['latin', 'arabic'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Nexus Boost - مسرع النظام والإنترنت',
    template: '%s | Nexus Boost'
  },
  description: 'تطبيق متطور لتحسين سرعة النظام والإنترنت مع توفير البطارية والعمل في أسوأ الظروف',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nexus Boost'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: 'Nexus Boost',
    title: 'Nexus Boost - مسرع النظام والإنترنت',
    description: 'تطبيق متطور لتحسين سرعة النظام والإنترنت مع توفير البطارية والعمل في أسوأ الظروف',
    images: '/og-image.jpg'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus Boost - مسرع النظام والإنترنت',
    description: 'تطبيق متطور لتحسين سرعة النظام والإنترنت مع توفير البطارية والعمل في أسوأ الظروف',
    images: '/og-image.jpg'
  }
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Register service worker on client side
  if (typeof window !== 'undefined') {
    registerServiceWorker()
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900`}>
        {children}
      </body>
    </html>
  )
}
