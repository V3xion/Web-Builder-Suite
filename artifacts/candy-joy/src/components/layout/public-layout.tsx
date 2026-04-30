import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { WhatsAppButton } from "../ui/whatsapp-button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
