import './globals.css'

export const metadata = {
  title: 'Weighing Calculator | Kou Hashizume',
  description: 'YVO₄ / GdVO₄合成用の秤量計算・記録ツール',
  authors: [{ name: 'Kou Hashizume' }],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/yvo4_gdvo4_weighing_icon.svg', type: 'image/svg+xml' },
      { url: '/yvo4_gdvo4_weighing_icon_preview.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/yvo4_gdvo4_weighing_icon.svg',
    apple: [
      { url: '/yvo4_gdvo4_weighing_icon_preview.png', type: 'image/png', sizes: '512x512' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Weighing Calculator',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
