export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: ProductImage[]; 
}

interface ProductImage {
  id: number;
  fileName: string;
  downloadUrl: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  products: Product[];
}

