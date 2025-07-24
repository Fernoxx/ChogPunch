export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F3E8FF] text-black">{children}</body>
    </html>
  )
}