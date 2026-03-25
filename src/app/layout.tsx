import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SpeedFusion Pro',
  description: 'نظام تحسين الأداء الذكي',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
