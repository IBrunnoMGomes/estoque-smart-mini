
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  expiryDate: string | null;
}

export type SortOption = 'name' | 'quantity' | 'expiryDate';
export type SortDirection = 'asc' | 'desc';
