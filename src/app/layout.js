import './globals.css'

export const metadata = {
  title: 'YVO4/GdVO4 秤量計算ツール',
  description: 'YVO4 と GdVO4 合成用の秤量計算ツール',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
