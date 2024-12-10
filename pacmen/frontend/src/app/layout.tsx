import { Providers } from "../shared/providers";

import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" style={{overflow:"hidden"}}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
