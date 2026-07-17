import "@/app/[locale]/globals.css";

export const metadata = {
  title: "Admin Panel | Advayur",
  description: "Advayur Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
