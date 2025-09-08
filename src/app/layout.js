import './globals.css'
import AnalyticsProvider from '@/components/AnalyticsProvider'

export const metadata = {
  title: 'iterate - The Blueprint for Product Excellence',
  description: 'Do You Have What It Takes to Be MVPM? Test your product management skills with brutal micro-simulations and AI-powered assessments.',
  keywords: 'product management, PM games, product manager assessment, MVPM, product skills test',
  authors: [{ name: 'iterate Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'iterate - The Blueprint for Product Excellence',
    description: 'Do You Have What It Takes to Be MVPM? Test your product management skills with brutal micro-simulations.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iterate - The Blueprint for Product Excellence',
    description: 'Do You Have What It Takes to Be MVPM? Test your product management skills with brutal micro-simulations.',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
