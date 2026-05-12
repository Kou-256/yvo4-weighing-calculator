import './globals.css'

export const metadata = {
  title: '秤量計算ツール',
  description: '複数の物質に対応する秤量計算ツール',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
