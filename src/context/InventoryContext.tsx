
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductFormData, SortOption, SortDirection } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { addDays, isPast, isWithinInterval } from 'date-fns';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: ProductFormData) => void;
  updateProduct: (id: string, product: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  sortProducts: (option: SortOption, direction: SortDirection) => void;
  filterProducts: (searchTerm: string, category: string) => void;
  getLowStockProducts: () => Product[];
  getNearExpiryProducts: () => Product[];
  filteredProducts: Product[];
  categories: string[];
  sortOption: SortOption;
  sortDirection: SortDirection;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products));
    applyFiltersAndSort();
  }, [products, sortOption, sortDirection, searchTerm, categoryFilter]);

  useEffect(() => {
    // Check for notifications on load and then every minute
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [products]);

  const applyFiltersAndSort = () => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply sort
    result.sort((a, b) => {
      if (sortOption === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortOption === 'quantity') {
        return sortDirection === 'asc'
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      } else if (sortOption === 'expiryDate') {
        // Handle null expiry dates by sorting them last
        if (a.expiryDate === null) return sortDirection === 'asc' ? 1 : -1;
        if (b.expiryDate === null) return sortDirection === 'asc' ? -1 : 1;
        
        return sortDirection === 'asc'
          ? new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
          : new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
      }
      return 0;
    });
    
    setFilteredProducts(result);
  };

  const checkNotifications = () => {
    const lowStockItems = getLowStockProducts();
    const expiryItems = getNearExpiryProducts();
    
    if (lowStockItems.length > 0) {
      toast.warning(`${lowStockItems.length} produtos com estoque baixo`, {
        description: "Verifique produtos que precisam ser repostos."
      });
    }
    
    if (expiryItems.length > 0) {
      toast.warning(`${expiryItems.length} produtos próximos do vencimento`, {
        description: "Verifique produtos com validade próxima."
      });
    }
  };

  const addProduct = (productData: ProductFormData) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: uuidv4(),
      ...productData,
      createdAt: now,
      updatedAt: now
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    toast.success('Produto adicionado com sucesso!');
  };

  const updateProduct = (id: string, productData: ProductFormData) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...productData, 
              updatedAt: new Date().toISOString() 
            } 
          : product
      )
    );
    toast.success('Produto atualizado com sucesso!');
  };

  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    toast.success('Produto removido com sucesso!');
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const sortProducts = (option: SortOption, direction: SortDirection) => {
    setSortOption(option);
    setSortDirection(direction);
  };

  const filterProducts = (term: string, category: string) => {
    setSearchTerm(term);
    setCategoryFilter(category);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity <= product.minQuantity);
  };

  const getNearExpiryProducts = () => {
    const today = new Date();
    const sevenDaysLater = addDays(today, 7);
    
    return products.filter(product => {
      if (!product.expiryDate) return false;
      
      const expiryDate = new Date(product.expiryDate);
      
      // Check if the product has expired or will expire within 7 days
      return isPast(expiryDate) || 
             isWithinInterval(expiryDate, { start: today, end: sevenDaysLater });
    });
  };

  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <InventoryContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      sortProducts,
      filterProducts,
      getLowStockProducts,
      getNearExpiryProducts,
      filteredProducts,
      categories,
      sortOption,
      sortDirection
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
