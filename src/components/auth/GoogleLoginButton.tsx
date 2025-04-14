
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface GoogleLoginButtonProps {
  isLoading: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ isLoading }) => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
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
  );
};
