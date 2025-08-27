'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi, cartItemApi } from '@/api';

interface ProductImage {
  id: number;
  fileName: string;
  downloadUrl: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: ProductImage[]; 
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string; // This will be the constructed URL
}

interface CartContextType {
  cart: CartItem[];
  totalPrice: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
  successMessage: string | null; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedCartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
    if (storedCartId) {
      setCartId(storedCartId);
    }
    fetchCart(storedCartId);
  }, []);

  const fetchCart = async (currentCartId: string | null) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      let activeCartId = currentCartId;
      console.log("Added to fetchcart : activeCartId = ", activeCartId);
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      console.log("Trying to fetch user cart Id for user id", userId);

      if (!activeCartId && userId) {
        // Attempt to get user's cart if no cartId exists locally
        const userCartResponse = await cartApi.getCartByUserId(userId);
        console.log(userCartResponse);
        if (userCartResponse.data.success && userCartResponse.data.data) {
          activeCartId = userCartResponse.data.data.cartId; 
          console.log(activeCartId);
          localStorage.setItem('cartId', activeCartId ?? '');
          setCartId(activeCartId);
          setCart(
            userCartResponse.data.data.items?.map((item: any) => ({ 
              productId: item.product.id, 
              name: item.product.name, 
              price: item.product.price, 
              quantity: item.quantity, 
              productImage: item.product.images && item.product.images.length > 0 
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.product.images[0].downloadUrl}` 
                : '', 
            })) || []
          );
          setTotalPrice(userCartResponse.data.data.totalAmount || 0);
        } else if (!userCartResponse.data.success && userCartResponse.data.message === 'Resource not found') {
          console.log("User has no existing cart.");
          setError('Your cart is empty.'); // Set a user-friendly message
        } else {
          setError(userCartResponse.data.message || 'Failed to initialize cart for user.');
          setCart([]);
          setTotalPrice(0);
          setLoading(false);
          return;
        }
      }

      if (activeCartId) {
        const cartResponse = await cartApi.getCart(activeCartId);
        if (cartResponse.data.success) {
          setCart(
            cartResponse.data.data.items?.map((item: any) => ({ 
              productId: item.product.id, 
              name: item.product.name, 
              price: item.product.price, 
              quantity: item.quantity, 
              productImage: item.product.images && item.product.images.length > 0 
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.product.images[0].downloadUrl}` 
                : '', 
            })) || []
          );
          setTotalPrice(cartResponse.data.data.totalPrice || 0);
        } else {
          setError(cartResponse.data.message || 'Failed to fetch cart.');
          setCart([]);
          setTotalPrice(0);
        }
      } else {
        setCart([]);
        setTotalPrice(0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching cart.');
      setCart([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      let currentCartId = cartId;
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      if (!userId) {
        setError('User not authenticated. Please log in to add items to cart.');
        setLoading(false);
        return;
      }

      if (!currentCartId) {
        const response = await cartItemApi.addItemToCart(productId, quantity);
        if (response.data.success) {
            const userCartResponse = await cartApi.getCartByUserId(userId);
            if(userCartResponse.data.success && userCartResponse.data.data) {
                const newCartId = userCartResponse.data.data.id; 
                localStorage.setItem('cartId', newCartId);
                setCartId(newCartId);
                await fetchCart(newCartId);
                setSuccessMessage('Item added to cart successfully!');
            } else {
              setError(userCartResponse.data.message || 'Failed to retrieve user cart after adding item.');
            }
        } else {
            setError(response.data.message || 'Failed to add item to cart.');
        }
      } else {
        const response = await cartItemApi.addItemToCart(productId, quantity, currentCartId);
        if (response.data.success) {
          await fetchCart(currentCartId);
          setSuccessMessage('Item added to cart successfully!');
        } else {
          setError(response.data.message || 'Failed to add item to cart.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while adding item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!cartId) {
      setError('No cart found to remove items from.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await cartItemApi.removeItemFromCart(cartId, productId);
      if (response.data.success) {
        await fetchCart(cartId);
        setSuccessMessage('Item removed from cart successfully!');
      } else {
        setError(response.data.message || 'Failed to remove item from cart.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while removing item from cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (!cartId) {
      setError('No cart found to update items in.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await cartItemApi.updateItemQuantity(cartId, productId, quantity);
      if (response.data.success) {
        await fetchCart(cartId);
        setSuccessMessage('Item quantity updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update item quantity.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while updating item quantity.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cartId) {
      setError('No cart found to clear.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await cartApi.clearCart(cartId);
      if (response.data.success) {
        setCart([]);
        setTotalPrice(0);
        localStorage.removeItem('cartId'); // Remove cartId from storage after clearing
        setCartId(null);
        setSuccessMessage('Cart cleared successfully!');
      } else {
        setError(response.data.message || 'Failed to clear cart.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while clearing cart.');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    cart,
    totalPrice,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    loading,
    error,
    successMessage,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};