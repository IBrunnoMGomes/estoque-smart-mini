
import React from 'react';
import { format, isPast, isWithinInterval, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Product } from '../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const isLowStock = product.quantity <= product.minQuantity;
  
  const getExpiryStatus = () => {
    if (!product.expiryDate) return null;
    
    const expiryDate = new Date(product.expiryDate);
    const today = new Date();
    
    if (isPast(expiryDate)) {
      return { status: 'expired', label: 'Vencido', color: 'destructive' };
    }
    
    if (isWithinInterval(expiryDate, { start: today, end: addDays(today, 7) })) {
      return { status: 'warning', label: 'Próximo ao vencimento', color: 'warning' };
    }
    
    return { status: 'ok', label: 'Válido', color: 'success' };
  };
  
  const expiryStatus = getExpiryStatus();

  return (
    <Card className={`overflow-hidden ${isLowStock ? 'border-warning' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Quantidade:</span>
            <span className={`font-medium ${isLowStock ? 'text-warning' : ''}`}>
              {product.quantity} {isLowStock && <AlertCircle className="inline h-4 w-4 ml-1" />}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Mínimo:</span>
            <span className="font-medium">{product.minQuantity}</span>
          </div>
          
          {product.expiryDate && (
            <div className="flex justify-between">
              <span className="text-sm">Validade:</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">
                  {format(new Date(product.expiryDate), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                {expiryStatus && (
                  <Badge variant={expiryStatus.color as any}>{expiryStatus.label}</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-2">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-1" 
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" /> Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-1 hover:bg-destructive hover:text-destructive-foreground" 
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
