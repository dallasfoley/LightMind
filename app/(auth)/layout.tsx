export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={` bg-zinc-900 antialiased`}>{children}</div>;
}
