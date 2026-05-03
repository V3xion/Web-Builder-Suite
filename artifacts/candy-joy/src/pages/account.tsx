import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetUserProfile,
  getGetUserProfileQueryKey,
  useUpdateUserProfile,
  useChangeUserPassword,
  useDeleteUserAccount,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9).optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmNewPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export default function AccountPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { logout, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!isLoggedIn) {
    setLocation("/login");
    return null;
  }

  const { data: profile, isLoading } = useGetUserProfile({
    query: { enabled: isLoggedIn, queryKey: getGetUserProfileQueryKey() },
  });

  const updateProfile = useUpdateUserProfile();
  const changePassword = useChangeUserPassword();
  const deleteAccount = useDeleteUserAccount();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: { fullName: profile?.fullName ?? "", phone: profile?.phone ?? "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const newPwValue = passwordForm.watch("newPassword");

  function onSaveProfile(values: z.infer<typeof profileSchema>) {
    updateProfile.mutate(
      { data: { fullName: values.fullName, phone: values.phone || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey() });
          toast({ title: t("auth.profileUpdated") });
          setIsEditing(false);
        },
        onError: () => toast({ title: "Failed to update profile.", variant: "destructive" }),
      }
    );
  }

  function onChangePassword(values: z.infer<typeof passwordSchema>) {
    changePassword.mutate(
      { data: { currentPassword: values.currentPassword, newPassword: values.newPassword } },
      {
        onSuccess: () => {
          toast({ title: t("auth.passwordUpdated") });
          passwordForm.reset();
        },
        onError: () => toast({ title: "Failed to update password.", variant: "destructive" }),
      }
    );
  }

  function onDeleteAccount() {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        logout();
        toast({ title: t("auth.accountDeleted") });
        setLocation("/");
      },
      onError: () => toast({ title: "Failed to delete account.", variant: "destructive" }),
    });
  }

  return (
    <PublicLayout>
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-10"
          >
            {t("auth.accountTitle")}
          </motion.h1>

          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/10 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <h2 className="text-xl font-serif font-semibold">{t("auth.editProfile")}</h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-40" />
              </div>
            ) : !isEditing ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("auth.fullName")}</p>
                  <p className="font-medium text-foreground">{profile?.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("auth.email")}</p>
                  <p className="font-medium text-foreground">{profile?.email}</p>
                </div>
                {profile?.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t("auth.phone")}</p>
                    <p className="font-medium text-foreground">{profile.phone}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit-profile"
                >
                  {t("auth.editProfile")}
                </Button>
              </div>
            ) : (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-5">
                  <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fullName")}</FormLabel>
                      <FormControl>
                        <Input className="bg-background focus-visible:ring-primary" data-testid="input-fullName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={profileForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.phone")}</FormLabel>
                      <FormControl>
                        <Input className="bg-background focus-visible:ring-primary" data-testid="input-phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={updateProfile.isPending} data-testid="button-save-profile">
                      {updateProfile.isPending ? t("auth.saving") : t("auth.saveChanges")}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                      {t("auth.cancelBtn")}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </motion.section>

          {/* Change Password Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/10 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-serif font-semibold">{t("auth.changePassword")}</h2>
            </div>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-5">
                <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.currentPassword")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showCurrentPw ? "text" : "password"} className="bg-background pe-10 focus-visible:ring-primary" data-testid="input-currentPassword" {...field} />
                        <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                          {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.newPassword")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showNewPw ? "text" : "password"} className="bg-background pe-10 focus-visible:ring-primary" data-testid="input-newPassword" {...field} />
                        <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowNewPw(!showNewPw)}>
                          {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <PasswordStrength password={newPwValue} />
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={passwordForm.control} name="confirmNewPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.confirmNewPassword")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showConfirmPw ? "text" : "password"} className="bg-background pe-10 focus-visible:ring-primary" data-testid="input-confirmNewPassword" {...field} />
                        <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                          {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={changePassword.isPending} data-testid="button-change-password">
                  {changePassword.isPending ? t("auth.updatingPassword") : t("auth.updatePassword")}
                </Button>
              </form>
            </Form>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-destructive/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <Trash2 size={20} />
              </div>
              <h2 className="text-xl font-serif font-semibold text-destructive">{t("auth.dangerZone")}</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{t("auth.deleteConfirm")}</p>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              data-testid="button-delete-account"
            >
              {t("auth.deleteAccount")}
            </Button>
          </motion.section>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border/20">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t("auth.deleteAccount")}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{t("auth.deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">
              {t("auth.cancelBtn")}
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteAccount}
              disabled={deleteAccount.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteAccount.isPending ? "Deleting..." : t("auth.deleteBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
