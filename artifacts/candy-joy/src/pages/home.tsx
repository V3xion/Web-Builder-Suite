import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Heart, Gift, ShoppingBag, Star } from "lucide-react";
import { useListProducts, useListReviews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const CATEGORY_KEYS: Record<string, string> = {
  "Chocolates": "menu.chocolates",
  "Imported Sweets": "menu.importedSweets",
  "Flowers & Gifts": "menu.flowersGifts",
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const { data: products, isLoading: isLoadingProducts } = useListProducts({ featured: true });
  const { data: reviews, isLoading: isLoadingReviews } = useListReviews();

  const approvedReviews = reviews?.filter(r => r.approved) || [];

  const features = [
    { icon: ShoppingBag, titleKey: "whyChooseUs.imported", descKey: "whyChooseUs.importedDesc" },
    { icon: Gift, titleKey: "whyChooseUs.floral", descKey: "whyChooseUs.floralDesc" },
    { icon: Heart, titleKey: "whyChooseUs.service", descKey: "whyChooseUs.serviceDesc" },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2000&auto=format&fit=crop"
            alt="Premium chocolates"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6">
              {t("hero.heading")} <span className="text-primary italic">{t("hero.headingAccent")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
              {t("hero.tagline")}
            </p>
            <Link href="/menu">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full relative overflow-hidden group">
                <span className="relative z-10">{t("hero.cta")}</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">{t("whyChooseUs.title")}</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="bg-background border border-border/10 p-8 rounded-2xl text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground">{t(feature.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">{t("featured.title")}</h2>
              <div className="w-24 h-1 bg-primary" />
            </div>
            <Link href="/menu" className="hidden md:inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
              {t("featured.viewAll")} <span className="ms-2">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingProducts
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                ))
              : products?.map((product, i) => (
                  <motion.div
                    key={product.id}
                    data-testid={`card-product-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={product.imageUrl || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=450&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 start-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-medium rounded-full text-primary">
                        {CATEGORY_KEYS[product.category] ? t(CATEGORY_KEYS[product.category]) : product.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-semibold">{isArabic && product.nameAr ? product.nameAr : product.name}</h3>
                        <span className="text-primary font-semibold">{product.price} {t("featured.aed")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{isArabic && product.descriptionAr ? product.descriptionAr : product.description}</p>
                      <a
                        href={`https://wa.me/971567772003?text=${encodeURIComponent(`Hi, I would like to order: ${product.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/90 transition-colors"
                      >
                        {t("featured.orderWhatsApp")}
                      </a>
                    </div>
                  </motion.div>
                ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link href="/menu">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t("featured.viewAll")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">{t("reviews.title")}</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingReviews
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-6 bg-background rounded-2xl">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))
              : approvedReviews.slice(0, 3).map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                    className="p-8 bg-background rounded-2xl border border-border/10 relative"
                  >
                    <div className="flex text-primary mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={18} fill={j < review.rating ? "currentColor" : "none"} className={j < review.rating ? "text-primary" : "text-muted"} />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-6">"{review.comment}"</p>
                    <p className="font-serif font-semibold text-foreground">— {review.authorName}</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
