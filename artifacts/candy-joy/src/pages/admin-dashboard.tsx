import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  useGetAdminStats, 
  useListProducts, 
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useListReviews,
  useDeleteReview,
  useUpdateReviewVisibility,
  useListMessages,
  useDeleteMessage,
  useMarkMessageRead,
  useGetSettings,
  useUpdateSettings,
  useAdminListUsers,
  useAdminChangeUserPassword,
  useAdminDeleteUser,
  getGetAdminStatsQueryKey,
  getListProductsQueryKey,
  getListReviewsQueryKey,
  getListMessagesQueryKey,
  getGetSettingsQueryKey,
  getAdminListUsersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Package, 
  Star, 
  MessageSquare, 
  Settings, 
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Users,
  KeyRound
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin/login");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border/10 p-6 flex flex-col shrink-0 h-auto md:h-screen md:sticky md:top-0">
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-primary">Candy Joy</h2>
          <p className="text-sm text-muted-foreground">Admin Portal</p>
        </div>

        <nav className="flex-1 space-y-2 mb-8 md:mb-0 overflow-x-auto md:overflow-visible flex md:block pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap md:whitespace-normal ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive mt-auto"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "reviews" && <ReviewsTab />}
        {activeTab === "messages" && <MessagesTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function DashboardTab() {
  const { data: stats, isLoading } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} />
        <StatCard title="Total Reviews" value={stats.totalReviews} icon={Star} />
        <StatCard title="Avg Rating" value={stats.averageRating.toFixed(1)} icon={Star} />
        <StatCard title="Unread Messages" value={stats.unreadMessages} icon={MessageSquare} highlight={stats.unreadMessages > 0} />
      </div>

      <div className="bg-card rounded-xl border border-border/10 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
        <div className="space-y-4">
          {stats.recentMessages.length === 0 ? (
            <p className="text-muted-foreground">No recent messages.</p>
          ) : (
            stats.recentMessages.map(msg => (
              <div key={msg.id} className="flex justify-between items-start pb-4 border-b border-border/10 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{msg.name} <span className="text-sm font-normal text-muted-foreground">({msg.email})</span></p>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{msg.message}</p>
                </div>
                {!msg.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, highlight = false }: { title: string, value: string|number, icon: any, highlight?: boolean }) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border/10 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${highlight ? "bg-primary text-primary-foreground" : "bg-background text-primary"}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAr: z.string().optional().or(z.literal('')),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().optional().or(z.literal('')),
  price: z.coerce.number().min(0, "Price must be positive"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

function ProductsTab() {
  const { data: products, isLoading } = useListProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", nameAr: "", category: "", description: "", descriptionAr: "", price: 0, imageUrl: "", featured: false }
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const payload = {
      ...values,
      imageUrl: values.imageUrl || "",
      nameAr: values.nameAr || undefined,
      descriptionAr: values.descriptionAr || undefined,
    };
    if (editingId) {
      updateProduct.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product updated" });
          setIsDialogOpen(false);
        }
      });
    } else {
      createProduct.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product created" });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    form.reset({
      name: product.name,
      nameAr: product.nameAr ?? "",
      category: product.category,
      description: product.description,
      descriptionAr: product.descriptionAr ?? "",
      price: product.price,
      imageUrl: product.imageUrl,
      featured: product.featured,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ name: "", nameAr: "", category: "", description: "", descriptionAr: "", price: 0, imageUrl: "", featured: false });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product deleted" });
        }
      });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-foreground">Manage Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}><Plus size={16} className="mr-2"/> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name (EN)</FormLabel><FormControl><Input placeholder="English name" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />
                  <FormField control={form.control} name="nameAr" render={({ field }) => (
                    <FormItem><FormLabel>الاسم (AR)</FormLabel><FormControl><Input dir="rtl" placeholder="الاسم بالعربي" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price (AED)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea placeholder="English description" {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="descriptionAr" render={({ field }) => (
                  <FormItem><FormLabel>الوصف (AR)</FormLabel><FormControl><Textarea dir="rtl" placeholder="الوصف بالعربي" {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5"><FormLabel>Featured Product</FormLabel></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>Save Product</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Featured</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map(product => (
                <tr key={product.id} className="border-b border-border/10 last:border-0 hover:bg-background/50">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center">
                    <img src={product.imageUrl || "https://picsum.photos/40"} className="w-10 h-10 rounded-md object-cover mr-3" />
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4">{product.price} AED</td>
                  <td className="px-6 py-4">{product.featured ? <CheckCircle2 className="text-primary" size={20}/> : <XCircle className="text-muted" size={20}/>}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReviewsTab() {
  const { data: reviews, isLoading } = useListReviews();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteReview = useDeleteReview();
  const updateVisibility = useUpdateReviewVisibility();

  const handleToggleVisibility = (id: number, currentApproved: boolean) => {
    updateVisibility.mutate({ id, data: { approved: !currentApproved } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        toast({ title: `Review ${!currentApproved ? 'approved' : 'hidden'}` });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete this review?")) {
      deleteReview.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
          toast({ title: "Review deleted" });
        }
      });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-foreground">Manage Reviews</h1>
      
      <div className="bg-card rounded-xl border border-border/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Comment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map(review => (
                <tr key={review.id} className="border-b border-border/10 last:border-0 hover:bg-background/50">
                  <td className="px-6 py-4 font-medium text-foreground">{review.authorName}</td>
                  <td className="px-6 py-4 flex text-primary">
                    {Array.from({ length: 5 }).map((_, i) => <Starey key={i} filled={i < review.rating} />)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{review.comment}</td>
                  <td className="px-6 py-4">
                    <Switch checked={review.approved} onCheckedChange={() => handleToggleVisibility(review.id, review.approved)} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(review.id)}><Trash2 size={16} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Starey({filled}: {filled:boolean}) {
  return <Star size={14} fill={filled ? "currentColor" : "none"} className={filled ? "text-primary" : "text-muted"} />;
}

function MessagesTab() {
  const { data: messages, isLoading } = useListMessages();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteMessage = useDeleteMessage();
  const markRead = useMarkMessageRead();

  const handleToggleRead = (id: number, currentRead: boolean) => {
    markRead.mutate({ id, data: { read: !currentRead } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete this message?")) {
      deleteMessage.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          toast({ title: "Message deleted" });
        }
      });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-foreground">Messages</h1>
      
      <div className="space-y-4">
        {messages?.map(msg => (
          <div key={msg.id} className={`bg-card rounded-xl border p-6 flex justify-between items-start transition-colors ${msg.read ? 'border-border/10' : 'border-primary/50 shadow-md'}`}>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-bold text-lg">{msg.name}</h3>
                <span className="text-sm text-muted-foreground">{msg.email}</span>
                {!msg.read && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">New</span>}
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
              <div className="text-xs text-muted-foreground mt-4">{new Date(msg.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex space-x-2 shrink-0 ml-4">
              <Button variant="outline" size="sm" onClick={() => handleToggleRead(msg.id, msg.read)}>
                {msg.read ? 'Mark Unread' : 'Mark Read'}
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(msg.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const changePasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function UsersTab() {
  const { data: users, isLoading } = useAdminListUsers({ query: { queryKey: getAdminListUsersQueryKey() } });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const changePassword = useAdminChangeUserPassword();
  const deleteUser = useAdminDeleteUser();

  const [selectedUser, setSelectedUser] = useState<{ id: number; fullName: string } | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const openPasswordDialog = (user: { id: number; fullName: string }) => {
    setSelectedUser(user);
    form.reset({ newPassword: "", confirmPassword: "" });
    setIsPasswordDialogOpen(true);
  };

  const onSubmitPassword = (values: z.infer<typeof changePasswordSchema>) => {
    if (!selectedUser) return;
    changePassword.mutate(
      { id: selectedUser.id, data: { newPassword: values.newPassword } },
      {
        onSuccess: () => {
          toast({ title: `Password updated for ${selectedUser.fullName}` });
          setIsPasswordDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Failed to update password", variant: "destructive" });
        },
      }
    );
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (confirm(`Are you sure you want to permanently delete ${name}'s account? This cannot be undone.`)) {
      deleteUser.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
          toast({ title: `${name}'s account deleted` });
        },
        onError: () => {
          toast({ title: "Failed to delete user", variant: "destructive" });
        },
      });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Registered Users</h1>
          <p className="text-muted-foreground mt-1">{users?.length ?? 0} total users</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No registered users yet.</td>
                </tr>
              )}
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-border/10 last:border-0 hover:bg-background/50">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.phone || <span className="italic opacity-50">—</span>}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPasswordDialog({ id: user.id, fullName: user.fullName })}
                    >
                      <KeyRound size={14} className="mr-1.5" />
                      Password
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteUser(user.id, user.fullName)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password — {selectedUser?.fullName}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-4">
              <FormField control={form.control} name="newPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl><Input type="password" placeholder="Min. 6 characters" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl><Input type="password" placeholder="Repeat new password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={changePassword.isPending}>
                  {changePassword.isPending ? "Saving…" : "Save Password"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const settingsSchema = z.object({
  phone: z.string(),
  whatsapp: z.string(),
  address: z.string(),
  instagramUrl: z.string(),
  tiktokUrl: z.string(),
});

function SettingsTab() {
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() }});
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        address: settings.address || "",
        instagramUrl: settings.instagramUrl || "",
        tiktokUrl: settings.tiktokUrl || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateSettings.mutate({ data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "Settings updated successfully" });
      }
    });
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-serif font-bold text-foreground">Store Settings</h1>
      
      <div className="bg-card rounded-xl border border-border/10 p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
              <FormItem><FormLabel>WhatsApp Number / Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Store Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <FormField control={form.control} name="instagramUrl" render={({ field }) => (
              <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <FormField control={form.control} name="tiktokUrl" render={({ field }) => (
              <FormItem><FormLabel>TikTok URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <Button type="submit" disabled={updateSettings.isPending}>Save Settings</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
