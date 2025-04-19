'use client'
import "./globals.css";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Providers from "./provider";
import RequireAuth from "@/app/components/requireAuth";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const isAuthRequired = pathName !== "/login" && pathName !== "/register";
  return (
    <html lang="en" className="h-full bg-white">
      <body>
        <Providers>
          <Header />
          <main className="flex-1 container mx-auto mt-[93px] h-[calc(100vh - 150px)] overflow-auto"> 
            {isAuthRequired ? <RequireAuth>{children}</RequireAuth>  : children} 
            </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
