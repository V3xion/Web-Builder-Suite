import { Link } from "wouter";
import { Phone, MapPin } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card pt-16 pb-8 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold text-primary mb-4">Candy Joy</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">{t("footer.tagline")}</p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                <SiInstagram size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                <SiTiktok size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold mb-4 text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.menu")}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold mb-4 text-foreground">{t("footer.visitUs")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="me-3 text-primary shrink-0 mt-1" size={20} />
                <span className="text-muted-foreground">{t("contact.address")}</span>
              </li>
              <li className="flex items-center">
                <Phone className="me-3 text-primary shrink-0" size={20} />
                <a href="tel:+971567772003" className="text-muted-foreground hover:text-primary transition-colors">
                  +971 56 777 2003
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">{t("footer.copyright")}</p>
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t("footer.adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
