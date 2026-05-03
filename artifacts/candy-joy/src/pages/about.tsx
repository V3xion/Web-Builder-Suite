import { PublicLayout } from "@/components/layout/public-layout";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  const timeline = [
    { yearKey: "about.year2019", eventKey: "about.event2019", descKey: "about.desc2019" },
    { yearKey: "about.year2021", eventKey: "about.event2021", descKey: "about.desc2021" },
    { yearKey: "about.year2023", eventKey: "about.event2023", descKey: "about.desc2023" },
  ];

  const values = [
    { titleKey: "about.quality", descKey: "about.qualityDesc" },
    { titleKey: "about.variety", descKey: "about.varietyDesc" },
    { titleKey: "about.warmth", descKey: "about.warmthDesc" },
  ];

  return (
    <PublicLayout>
      <section className="pt-32 pb-16 bg-card relative overflow-hidden border-b border-border/10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
            >
              {t("about.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              {t("about.subtitle")}
            </motion.p>
          </div>
        </div>
      </section>

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
              <p className="text-muted-foreground text-lg leading-relaxed">{t("about.story1")}</p>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("about.story2")}</p>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("about.story3")}</p>
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

      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">{t("about.valuesTitle")}</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-4"
              >
                <div className="text-5xl font-serif font-bold text-primary/20">{`0${i + 1}`}</div>
                <h3 className="text-2xl font-serif font-bold text-foreground">{t(value.titleKey)}</h3>
                <p className="text-muted-foreground">{t(value.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">{t("about.timelineTitle")}</h2>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ms-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-card border border-border/10 shadow-sm">
                  <span className="font-serif font-bold text-primary text-xl mb-1 block">{t(item.yearKey)}</span>
                  <h3 className="font-bold text-foreground text-lg mb-2">{t(item.eventKey)}</h3>
                  <p className="text-muted-foreground">{t(item.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
