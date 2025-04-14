
import React from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleResetData = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('inventory-products');
      toast.success('Dados resetados com sucesso! Recarregue a página para ver as mudanças.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Configurações</h2>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como você deseja receber as notificações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notification-stock">Notificação de estoque baixo</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando produtos estiverem abaixo do estoque mínimo
                </p>
              </div>
              <Switch id="notification-stock" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notification-expiry">Notificação de vencimento</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas sobre produtos próximos do vencimento
                </p>
              </div>
              <Switch id="notification-expiry" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="days-before-expiry">Dias antes do vencimento</Label>
              <Input
                id="days-before-expiry"
                type="number"
                defaultValue={7}
                min={1}
                className="max-w-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Defina quantos dias antes do vencimento você deseja receber notificações
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Sistema</CardTitle>
            <CardDescription>
              Opções para manipulação dos dados armazenados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Backup e Restauração</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Exporte ou importe os dados do seu inventário
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar Dados</Button>
                  <Button variant="outline">Importar Dados</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-destructive">Zona de Perigo</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Ações irreversíveis que afetam seus dados
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleResetData}
                >
                  Resetar Todos os Dados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
