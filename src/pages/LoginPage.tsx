
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { AuthSeparator } from '@/components/auth/AuthSeparator';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoginSuccess = () => {
    // Redirecionar para a página anterior ou para a dashboard
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
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
              <LoginForm 
                onSuccess={handleLoginSuccess}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              <AuthSeparator />
              <GoogleLoginButton isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              <AuthSeparator />
              <GoogleLoginButton isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
