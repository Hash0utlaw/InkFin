import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InkFinder',
  description: 'Find your perfect tattoo artist and design',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}