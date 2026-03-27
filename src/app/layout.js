import './globals.css';
export const metadata = {
  title: 'SpeedFusion Pro',
  description: 'Next-Gen System Optimizer',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  appleWebApp: { title: 'SpeedFusion', statusBarStyle: 'black-translucent' },
};

export default function RootLayout({ children }) {
  return (
    <html lang='ar' dir='rtl'>
      <body className='bg-black text-white antialiased'>{children}</body>
    </html>
  );
}
