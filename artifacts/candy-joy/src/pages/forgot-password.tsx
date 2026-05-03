import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForgotPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const forgotPassword = useForgotPassword();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    forgotPassword.mutate({ data: values }, {
      onSuccess: () => setSent(true),
      onError: () => setSent(true),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0500] via-[#1a0a00] to-[#2c1a0e] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif font-bold text-primary">Candy Joy</Link>
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-1">{t("auth.forgotTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("auth.forgotSubtitle")}</p>
        </div>

        <div className="bg-card border border-border/20 rounded-2xl shadow-2xl p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
              <p className="text-foreground font-medium mb-6">{t("auth.resetSent")}</p>
              <Link href="/login" className="text-primary hover:underline text-sm flex items-center justify-center gap-1">
                <ArrowLeft size={14} />
                {t("auth.backToLogin")}
              </Link>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        className="bg-background focus-visible:ring-primary"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 rounded-xl"
                  disabled={forgotPassword.isPending}
                  data-testid="button-send-reset"
                >
                  {forgotPassword.isPending ? t("auth.sending") : t("auth.sendReset")}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                    <ArrowLeft size={14} />
                    {t("auth.backToLogin")}
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
