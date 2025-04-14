
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import ProductCard from './ProductCard';
import { Product, SortOption, SortDirection } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowUpDown,
  Plus,
  Search,
  X,
  AlertCircle,
  Clock,
  Package2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProductForm from './ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductsListProps {
  onAddProduct: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ onAddProduct }) => {
  const {
    filteredProducts,
    categories,
    sortProducts,
    filterProducts,
    sortOption,
    sortDirection,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getNearExpiryProducts,
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const lowStockProducts = getLowStockProducts();
  const expiryProducts = getNearExpiryProducts();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (formData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(value, categoryFilter);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    filterProducts(searchTerm, value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    filterProducts('', '');
  };

  const handleSort = (option: SortOption) => {
    const newDirection: SortDirection =
      option === sortOption && sortDirection === 'asc' ? 'desc' : 'asc';
    sortProducts(option, newDirection);
  };

  const displayProducts = () => {
    let productsToShow = filteredProducts;
    
    if (activeTab === 'low-stock') {
      productsToShow = lowStockProducts.filter(p => 
        filteredProducts.some(fp => fp.id === p.id)
      );
    } else if (activeTab === 'expiry') {
      productsToShow = expiryProducts.filter(p => 
        filteredProducts.some(fp => fp.id === p.id)
      );
    }
    
    if (productsToShow.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Package2 className="h-16 w-16 mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1">Nenhum produto encontrado</h3>
          <p className="text-sm">
            {activeTab === 'all' 
              ? 'Adicione produtos ao seu inventário ou ajuste os filtros.' 
              : activeTab === 'low-stock' 
                ? 'Não há produtos com estoque baixo.' 
                : 'Não há produtos próximos ao vencimento.'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productsToShow.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <Button onClick={onAddProduct} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Adicionar Produto
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Select
          value={categoryFilter}
          onValueChange={handleCategoryFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category, index) => (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {(searchTerm || categoryFilter) && (
          <Button variant="outline" onClick={handleClearFilters} size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex justify-between items-center flex-wrap gap-2">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all" className="flex gap-1">
              <Package2 className="h-4 w-4" />
              <span className="hidden md:inline">Todos</span>
            </TabsTrigger>
            <TabsTrigger value="low-stock" className="flex gap-1">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden md:inline">Estoque Baixo</span>
              {lowStockProducts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {lowStockProducts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="expiry" className="flex gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Vencimento Próximo</span>
              {expiryProducts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {expiryProducts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleSort('name')}
          >
            Nome
            <ArrowUpDown className={`h-3.5 w-3.5 ${sortOption === 'name' ? 'opacity-100' : 'opacity-40'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleSort('quantity')}
          >
            Qtd
            <ArrowUpDown className={`h-3.5 w-3.5 ${sortOption === 'quantity' ? 'opacity-100' : 'opacity-40'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleSort('expiryDate')}
          >
            Validade
            <ArrowUpDown className={`h-3.5 w-3.5 ${sortOption === 'expiryDate' ? 'opacity-100' : 'opacity-40'}`} />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[calc(100vh-330px)]">
        {displayProducts()}
      </ScrollArea>
      
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={{
                name: editingProduct.name,
                category: editingProduct.category,
                quantity: editingProduct.quantity,
                minQuantity: editingProduct.minQuantity,
                price: editingProduct.price,
                expiryDate: editingProduct.expiryDate,
              }}
              onSubmit={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsList;
