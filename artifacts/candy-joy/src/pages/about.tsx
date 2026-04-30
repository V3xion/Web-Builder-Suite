import { PublicLayout } from "@/components/layout/public-layout";
import { motion } from "framer-motion";

export default function About() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-card relative overflow-hidden border-b border-border/10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
            >
              Our Story
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              A journey of passion, taste, and the art of gifting in the heart of Abu Dhabi.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif font-bold text-primary">The Candy Joy Promise</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Founded with a deep love for fine confectionery, Candy Joy Chocolate is more than just a sweet shop. It's a destination for those who appreciate the finer things in life.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Located in the vibrant Refah Gift Market of Abu Dhabi, we've carefully curated a selection of the world's finest imported chocolates, combining them with exquisite floral arrangements to create perfect moments of joy.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're looking for a thoughtful gift, preparing for a special occasion, or simply indulging yourself, our boutique offers an intimate, welcoming atmosphere where quality always comes first.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="https://picsum.photos/seed/choc1/400/500" alt="Chocolate display" className="rounded-2xl w-full h-full object-cover shadow-lg" />
              <div className="space-y-4 pt-8">
                <img src="https://picsum.photos/seed/flowers1/400/300" alt="Floral arrangement" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
                <img src="https://picsum.photos/seed/store1/400/400" alt="Store interior" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            {[
              { title: "Quality", desc: "We source only the finest imported chocolates from renowned chocolatiers globally." },
              { title: "Variety", desc: "From dark, rich truffles to vibrant, fresh flowers, our diverse range ensures there's something for everyone." },
              { title: "Warmth", desc: "Every customer is treated like family. Our boutique is a place of comfort and joy." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-4"
              >
                <div className="text-5xl font-serif font-bold text-primary/20">{`0${i+1}`}</div>
                <h3 className="text-2xl font-serif font-bold text-foreground">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">Our Journey</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
            {[
              { year: "2019", title: "Founded", desc: "Candy Joy Chocolate opened its doors in Abu Dhabi." },
              { year: "2021", title: "Expanded", desc: "Introduced our signature floral arrangements line." },
              { year: "2023", title: "Growing", desc: "Became a premier destination for luxury gifting in the UAE." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-card border border-border/10 shadow-sm">
                  <span className="font-serif font-bold text-primary text-xl mb-1 block">{item.year}</span>
                  <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
