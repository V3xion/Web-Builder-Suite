import { PublicLayout } from "@/components/layout/public-layout";
import { Input } from "@/components/ui/input";
import { useListProducts } from "@workspace/api-client-react";
import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useListProducts({ 
    category: activeCategory !== "All" ? activeCategory : undefined,
    search: searchQuery || undefined
  });

  const categories = ["All", "Chocolates", "Imported Sweets", "Flowers & Gifts"];

  return (
    <PublicLayout>
      <div className="bg-card pt-32 pb-16 border-b border-border/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Our Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Browse our exquisite selection of imported chocolates, delightful sweets, and elegant floral arrangements.
          </p>
          
          <div className="max-w-md mx-auto relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="search" 
              placeholder="Search for sweets, chocolates..." 
              className="pl-12 py-6 bg-background rounded-full border-border/20 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-background border border-border/20 text-muted-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, i) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 4) * 0.1, duration: 0.4 }}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/10 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden relative bg-background">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop"} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.featured && (
                      <div className="absolute top-4 right-4 bg-primary px-3 py-1 text-xs font-bold rounded-full text-primary-foreground">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{product.category}</div>
                    <h3 className="text-lg font-serif font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-foreground">{product.price} <span className="text-sm font-normal text-muted-foreground">AED</span></span>
                      <a 
                        href={`https://wa.me/971567772003?text=Hi, I would like to order: ${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                        title="Order via WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-serif text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
