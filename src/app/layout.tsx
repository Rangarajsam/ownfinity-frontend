import "./globals.css";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Providers from "./provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body>
        <Providers>
          <Header />
          <main className="flex-1 container mx-auto mt-[93px] h-[calc(100vh - 50px)] overflow-auto"> {children} </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
