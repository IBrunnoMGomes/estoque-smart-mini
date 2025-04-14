
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package2,
  AlertCircle,
  ShoppingCart,
  Clock,
  TrendingUp,
  BarChart
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    products, 
    getLowStockProducts, 
    getNearExpiryProducts 
  } = useInventory();

  const lowStockProducts = getLowStockProducts();
  const expiryProducts = getNearExpiryProducts();
  
  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price, 
    0
  );

  const statsCards = [
    {
      title: "Total de Produtos",
      value: totalProducts,
      icon: <Package2 className="h-5 w-5" />,
      description: "Produtos cadastrados"
    },
    {
      title: "Estoque Baixo",
      value: lowStockProducts.length,
      icon: <AlertCircle className="h-5 w-5 text-warning" />,
      description: "Produtos para repor"
    },
    {
      title: "Próximos ao Vencimento",
      value: expiryProducts.length,
      icon: <Clock className="h-5 w-5 text-warning" />,
      description: "Produtos a vencer"
    },
    {
      title: "Valor em Estoque",
      value: `R$ ${totalStockValue.toFixed(2)}`,
      icon: <ShoppingCart className="h-5 w-5 text-info" />,
      description: "Valor total"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos com Estoque Baixo
            </CardTitle>
            <BarChart className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div className="text-sm truncate" style={{ maxWidth: "70%" }}>
                      {product.name}
                    </div>
                    <div className="text-sm font-medium text-warning">
                      {product.quantity} / {product.minQuantity}
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    + {lowStockProducts.length - 5} outros produtos
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                Todos os produtos estão com estoque adequado
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Próximos ao Vencimento
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {expiryProducts.length > 0 ? (
              <div className="space-y-2">
                {expiryProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div className="text-sm truncate" style={{ maxWidth: "70%" }}>
                      {product.name}
                    </div>
                    <div className="text-sm font-medium text-warning">
                      {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('pt-BR') : '-'}
                    </div>
                  </div>
                ))}
                {expiryProducts.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    + {expiryProducts.length - 5} outros produtos
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                Nenhum produto próximo ao vencimento
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
