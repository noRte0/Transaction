import Image from "next/image";
import SessionProvider from "../components/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <div style={{ position: 'relative', width: '45%', height: '100vh' }}>
        <Image
          src="/b71ce8f58aada5d09c49c34638979379.jpg"
          alt="Transaction"
          layout="fill"
          objectFit="cover"  
          style={{ position: 'absolute', right: 0 }}
        />
      </div>
    </div>
    </SessionProvider>
  );
}
