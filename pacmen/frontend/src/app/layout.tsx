import { Providers } from "../shared/providers";
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <iframe
          className={"pacmanVideo"}
          height="100vh"
          width="300vw"
          src="https://www.youtube.com/embed/fH55CJQtE9M?si=lCQtlUtycWKxGbbn&autoplay=1&mute=1&end=45&controls=0&playlist=fH55CJQtE9M&loop=1&rel=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          autoFocus
        ></iframe>
         <div className={"loginScreen_gradient"}></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
