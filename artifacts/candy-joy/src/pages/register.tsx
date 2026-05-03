import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRegisterUser } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(9, "Phone number is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Must contain at least 1 number"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v === true, "You must agree to the terms"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function PasswordStrength({ password }: { password: string }) {
  const { t } = useTranslation();
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0);

  if (!password) return null;

  const label = score <= 1 ? t("auth.strengthWeak") : score === 2 ? t("auth.strengthMedium") : t("auth.strengthStrong");
  const color = score <= 1 ? "bg-red-500" : score === 2 ? "bg-yellow-400" : "bg-green-500";
  const textColor = score <= 1 ? "text-red-400" : score === 2 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= score ? color : "bg-border/30")} />
        ))}
      </div>
      <p className={cn("text-xs", textColor)}>{label}</p>
    </div>
  );
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const registerUser = useRegisterUser();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false },
  });

  const passwordValue = form.watch("password");

  function onSubmit(values: z.infer<typeof schema>) {
    registerUser.mutate(
      { data: { fullName: values.fullName, email: values.email, phone: values.phone, password: values.password } },
      {
        onSuccess: (data) => {
          login(data.token);
          toast({ title: t("auth.registerSuccess") });
          setLocation("/");
        },
        onError: (err: unknown) => {
          const status = (err as { response?: { status?: number } })?.response?.status;
          if (status === 409) {
            form.setError("email", { message: "Email already in use" });
          } else {
            toast({ title: "Registration failed. Please try again.", variant: "destructive" });
          }
        },
      }
    );
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
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-1">{t("auth.registerTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("auth.registerSubtitle")}</p>
        </div>

        <div className="bg-card border border-border/20 rounded-2xl shadow-2xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("auth.fullNamePlaceholder")}
                      className="bg-background focus-visible:ring-primary"
                      data-testid="input-fullName"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

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

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.phone")}</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-s-md border border-e-0 border-input bg-muted text-muted-foreground text-sm">
                        +971
                      </span>
                      <Input
                        placeholder="50 000 0000"
                        className="bg-background rounded-s-none focus-visible:ring-primary"
                        data-testid="input-phone"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.passwordPlaceholder")}
                        className="bg-background pe-10 focus-visible:ring-primary"
                        data-testid="input-password"
                        {...field}
                      />
                      <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrength password={passwordValue} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder={t("auth.confirmPasswordPlaceholder")}
                        className="bg-background pe-10 focus-visible:ring-primary"
                        data-testid="input-confirmPassword"
                        {...field}
                      />
                      <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="terms" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 rtl:space-x-reverse space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                      data-testid="checkbox-terms"
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel className="text-sm font-normal text-muted-foreground cursor-pointer">
                      {t("auth.termsCheck")}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 rounded-xl"
                disabled={registerUser.isPending}
                data-testid="button-register"
              >
                {registerUser.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("auth.registering")}
                  </span>
                ) : t("auth.registerBtn")}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t("auth.loginLink")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
