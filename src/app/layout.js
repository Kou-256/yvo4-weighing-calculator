import './globals.css'

export const metadata = {
  title: 'Weighing Calculator | Kou Hashizume',
  description: 'YVO₄ / GdVO₄合成用の秤量計算・記録ツール',
  authors: [{ name: 'Kou Hashizume' }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
