import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elastiquality - Encontre profissionais para tudo',
  description: 'Mais de 500 tipos de serviços em um só lugar. Conectamos clientes com os melhores profissionais de Portugal.',
  keywords: 'serviços, profissionais, Portugal, eletricista, canalizador, limpeza, jardinagem',
  authors: [{ name: 'Elastiquality' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'Elastiquality - Encontre profissionais para tudo',
    description: 'Mais de 500 tipos de serviços em um só lugar. Conectamos clientes com os melhores profissionais de Portugal.',
    url: 'https://elastiquality.vercel.app',
    siteName: 'Elastiquality',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Elastiquality',
      },
    ],
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elastiquality - Encontre profissionais para tudo',
    description: 'Mais de 500 tipos de serviços em um só lugar. Conectamos clientes com os melhores profissionais de Portugal.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
