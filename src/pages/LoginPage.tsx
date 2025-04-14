
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Formulário de login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Formulário de registro
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Função de login
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error('Erro ao fazer login: ' + error.message);
      } else {
        toast.success('Login realizado com sucesso!');
        
        // Redirecionar para a página anterior ou para a dashboard
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error('Erro ao fazer login: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        toast.error('Erro ao criar conta: ' + error.message);
      } else {
        toast.success('Conta criada com sucesso! Por favor, verifique seu email para confirmar o registro.');
        registerForm.reset();
      }
    } catch (error: any) {
      toast.error('Erro ao criar conta: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login com Google
  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <LogIn className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Estoque Smart</CardTitle>
          <CardDescription className="text-center">
            Entre ou crie sua conta para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 mt-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou continue com
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#EA4335" d="M5.266 9.804A7.008 7.008 0 0 1 12 4.818a6.76 6.76 0 0 1 4.604 1.78l3.178-3.178A11.954 11.954 0 0 0 12 0C7.288 0 3.274 2.626 1.258 6.44l3.998 3.364z"/>
                      <path fill="#34A853" d="M16.724 18.021A7.004 7.004 0 0 1 12 19.182c-3.017 0-5.545-1.91-6.522-4.578L1.5 17.854C3.55 21.658 7.4 24 12 24c3.255 0 5.987-1.054 8-2.97v.03l3.5-3.5-3.5-3.5c-1 1 -2.295 1.498-3.276 1.96z"/>
                      <path fill="#4285F4" d="M23.49 12.27a11.528 11.528 0 0 0-.19-2.453H12.005v4.642h6.595a5.536 5.536 0 0 1-2.461 3.561l3.066 2.352c1.881-1.73 2.966-4.276 2.966-7.473z"/>
                      <path fill="#FBBC05" d="M5.478 14.604A7.058 7.058 0 0 1 5.068 12c0-.904.175-1.773.478-2.604L1.258 6.44A11.897 11.897 0 0 0 0 12c0 1.936.478 3.772 1.258 5.401l3.902-3.346.318.55z"/>
                    </svg>
                    Continuar com Google
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 mt-4">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou continue com
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#EA4335" d="M5.266 9.804A7.008 7.008 0 0 1 12 4.818a6.76 6.76 0 0 1 4.604 1.78l3.178-3.178A11.954 11.954 0 0 0 12 0C7.288 0 3.274 2.626 1.258 6.44l3.998 3.364z"/>
                      <path fill="#34A853" d="M16.724 18.021A7.004 7.004 0 0 1 12 19.182c-3.017 0-5.545-1.91-6.522-4.578L1.5 17.854C3.55 21.658 7.4 24 12 24c3.255 0 5.987-1.054 8-2.97v.03l3.5-3.5-3.5-3.5c-1 1 -2.295 1.498-3.276 1.96z"/>
                      <path fill="#4285F4" d="M23.49 12.27a11.528 11.528 0 0 0-.19-2.453H12.005v4.642h6.595a5.536 5.536 0 0 1-2.461 3.561l3.066 2.352c1.881-1.73 2.966-4.276 2.966-7.473z"/>
                      <path fill="#FBBC05" d="M5.478 14.604A7.058 7.058 0 0 1 5.068 12c0-.904.175-1.773.478-2.604L1.258 6.44A11.897 11.897 0 0 0 0 12c0 1.936.478 3.772 1.258 5.401l3.902-3.346.318.55z"/>
                    </svg>
                    Continuar com Google
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
