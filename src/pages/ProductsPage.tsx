
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProductsList from '@/components/ProductsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/ProductForm';
import { useInventory } from '@/context/InventoryContext';
import { ProductFormData } from '@/types';

const ProductsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { addProduct } = useInventory();

  const handleAddProduct = () => {
    setIsAddDialogOpen(true);
  };

  const handleFormSubmit = (data: ProductFormData) => {
    addProduct(data);
    setIsAddDialogOpen(false);
  };

  const handleFormCancel = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <Layout>
      <ProductsList onAddProduct={handleAddProduct} />
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProductsPage;
