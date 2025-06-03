import Navbar from "./Navbar";

export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main
        >
          <Navbar />
          {children}
      </main>
  );
}
