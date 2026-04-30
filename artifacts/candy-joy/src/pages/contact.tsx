import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMessage } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const createMessage = useCreateMessage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMessage.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again or contact us via WhatsApp.",
          variant: "destructive"
        });
      }
    });
  }

  return (
    <PublicLayout>
      <section className="pt-32 pb-16 bg-card border-b border-border/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Visit our store or send us a message.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info & Map */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-2xl border border-border/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <MapPin size={24} />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">Visit Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Refah Gift Market,<br />
                    Industrial Area,<br />
                    Shiebat Al Salam,<br />
                    Abu Dhabi, UAE
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-2xl border border-border/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">Call Us</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Available during store hours for orders and inquiries.
                  </p>
                  <a href="tel:+971567772003" className="text-primary font-medium hover:underline">
                    +971 56 777 2003
                  </a>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border/10 h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115822.42777328905!2d54.49845070000001!3d24.8823528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e5f3060fc11ab%3A0x6b801a6e9a660a17!2sIndustrial%20Area%20-%20Shiebat%20Al%20Salam%20-%20Abu%20Dhabi!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card p-8 md:p-10 rounded-2xl border border-border/10"
            >
              <h2 className="text-3xl font-serif font-bold mb-8">Send a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can we help you today?" className="min-h-[150px] bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createMessage.isPending}>
                    {createMessage.isPending ? "Sending..." : (
                      <>
                        Send Message <Send size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
