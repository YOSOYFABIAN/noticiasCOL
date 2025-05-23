import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNewsletterSubscription } from "@/hooks/use-news";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Check } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
  children: React.ReactNode;
}

export function NewsletterSignup({ children }: NewsletterSignupProps) {
  const [open, setOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  
  const subscription = useNewsletterSubscription();
  
  const form = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterForm) => {
    try {
      await subscription.mutateAsync(data.email);
      setIsSubscribed(true);
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito correctamente al newsletter de NoticiasCOL.",
      });
      form.reset();
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setIsSubscribed(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error en la suscripción",
        description: "Hubo un problema al suscribirte. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center font-playfair">
            <Mail className="w-5 h-5 mr-2 text-brand-primary" />
            Newsletter NoticiasCOL
          </DialogTitle>
          <DialogDescription>
            Recibe las noticias más importantes de Colombia directamente en tu email. 
            Resúmenes inteligentes, análisis y actualizaciones en tiempo real.
          </DialogDescription>
        </DialogHeader>
        
        {isSubscribed ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              ¡Suscripción Exitosa!
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Hemos enviado un email de confirmación. 
              Revisa tu bandeja de entrada.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                        disabled={subscription.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-blue-700"
                  disabled={subscription.isPending}
                >
                  {subscription.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Suscribiendo...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Suscribirme Gratis
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Al suscribirte aceptas recibir emails de NoticiasCOL. 
                  Puedes cancelar en cualquier momento.
                </p>
              </div>
            </form>
          </Form>
        )}
        
        {/* Benefits */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-3">¿Qué recibirás?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Resúmenes diarios con IA
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Noticias de última hora
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Análisis semanal de tendencias
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Sin spam, solo noticias relevantes
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
