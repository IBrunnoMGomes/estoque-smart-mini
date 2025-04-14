
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Package2,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link to={to}>
    <Button
      variant={isActive ? 'default' : 'ghost'}
      className={cn(
        'w-full justify-start mb-1',
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      )}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  </Link>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  // Extrair as iniciais ou email para o avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const navItems = [
    {
      to: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
    },
    {
      to: '/produtos',
      icon: <Package2 className="h-5 w-5" />,
      label: 'Produtos',
    },
    {
      to: '/configuracoes',
      icon: <Settings className="h-5 w-5" />,
      label: 'Configurações',
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold">Estoque Smart</h1>
            <p className="text-sm text-muted-foreground">Mini Market Edition</p>
          </div>
          
          <nav className="flex-1 p-4">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={
                  item.to === '/' 
                    ? currentPath === '/'
                    : currentPath.startsWith(item.to)
                }
              />
            ))}
          </nav>
          
          <div className="p-4 border-t border-border mt-auto">
            {user && (
              <div className="mb-4 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="border-b border-border p-4 md:hidden">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Estoque Smart</h1>
            {user && (
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>
        
        {/* Mobile navigation */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background z-10 md:hidden">
          <div className="flex justify-around">
            {navItems.map((item, index) => (
              <Link key={index} to={item.to} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full py-3 flex flex-col items-center justify-center rounded-none',
                    (item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to))
                      ? 'text-primary border-t-2 border-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Page content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto pb-16 md:pb-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
