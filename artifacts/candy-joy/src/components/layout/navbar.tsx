import { Link, useLocation } from "wouter";
import { Menu, X, User, ChevronDown, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useGetUserProfile, getGetUserProfileQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

export function Navbar() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: userProfile } = useGetUserProfile({
    query: { enabled: isLoggedIn, queryKey: getGetUserProfileQueryKey() },
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isArabic = i18n.language.startsWith("ar");

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: getGetUserProfileQueryKey() });
    setIsUserMenuOpen(false);
    setLocation("/");
  };

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.menu"), href: "/menu" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const firstName = userProfile?.fullName?.split(" ")[0] ?? "";

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-border/20 shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-wide">
            Candy Joy
          </Link>

          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={toggleLanguage}
              className="text-sm font-medium px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
              data-testid="button-language-toggle"
            >
              {isArabic ? "EN" : "AR"}
            </button>

            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  data-testid="button-user-menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <span>{firstName}</span>
                  <ChevronDown size={14} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-card border border-border/20 rounded-xl shadow-lg py-2 z-50">
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <User size={14} />
                      {t("nav.myAccount")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-destructive hover:bg-destructive/5 transition-colors"
                      data-testid="button-logout"
                    >
                      <LogOut size={14} />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                data-testid="link-login"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/20 shadow-lg py-4 px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location === link.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t border-border/10">
            <button
              onClick={() => { toggleLanguage(); setIsOpen(false); }}
              className="text-sm font-medium px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              {isArabic ? "EN" : "AR"}
            </button>
            {isLoggedIn ? (
              <>
                <Link href="/account" onClick={() => setIsOpen(false)} className="text-sm text-primary flex items-center gap-1">
                  <User size={14} /> {t("nav.myAccount")}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-sm text-foreground/60 flex items-center gap-1">
                  <LogOut size={14} /> {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm font-medium text-primary border border-primary px-3 py-1.5 rounded-full">
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
