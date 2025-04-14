
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Package2,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react';

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
  const currentPath = location.pathname;

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
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
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
