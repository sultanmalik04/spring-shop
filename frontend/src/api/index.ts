import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Replace with your Spring Boot backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRolesFromToken = (): string[] => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || [];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return [];
    }
  }
  return [];
};

// Placeholder for API functions
export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  // Add other auth related APIs here
};

export const userApi = {
  getUserById: (userId: string) => api.get(`/users/${userId}/user`),
  createUser: (userData: any) => api.post('/users/add', userData),
  updateUser: (userId: string, userData: any) => api.put(`/users/${userId}/update`, userData),
  deleteUser: (userId: string) => api.delete(`/users/${userId}/delete`),
  getAllUsers: () => api.get('/users/all'), // Added getAllUsers API call
};

export const categoryApi = {
  getAllCategories: () => api.get('/categories/all'),
  addCategory: (categoryData: any) => api.post('/categories/add', categoryData),
  getCategoryById: (id: string) => api.get(`/categories/category/${id}/category`),
  getCategoryByName: (name: string) => api.get(`/categories/category/${name}/category`),
  updateCategory: (id: string, categoryData: any) => api.put(`/categories/category/${id}/update`, categoryData),
  deleteCategory: (id: string) => api.delete(`/categories/category/${id}/delete`),
};

export const productApi = {
  getAllProducts: () => api.get('/products/all'),
  getProductById: (id: string) => api.get(`/products/product/${id}/product`),
  addProduct: (productData: any) => api.post('/products/add', productData),
  updateProduct: (productId: string, productData: any) => api.put(`/products/product/${productId}/update`, productData),
  deleteProduct: (productId: string) => api.delete(`/products/product/${productId}/delete`),
  getProductsByBrandAndName: (brandName: string, productName: string) => api.get(`/products/product/by/brand-and-name?brandName=${brandName}&productName=${productName}`),
  getProductsByCategoryAndBrand: (category: string, brand: string) => api.get(`/products/product/by/category-and-brand?category=${category}&brand=${brand}`),
  getProductsByName: (name: string) => api.get(`/products/product/${name}`),
  getProductsByBrand: (brand: string) => api.get(`/products/product/by-brand?brand=${brand}`),
  getProductsByCategory: (category: string) => api.get(`/products/product/${category}/all/product`),
  countProductsByBrandAndName: (brand: string, name: string) => api.get(`/products/product/count/by-brand/and-name?brand=${brand}&name=${name}`),
};

export const cartApi = {
  getCart: (cartId: string) => api.get(`/carts/${cartId}/my-cart`),
  getCartByUserId: (userId: string) => api.get(`/carts/user/${userId}`),
  clearCart: (cartId: string) => api.delete(`/carts/${cartId}/clear`),
  getTotalAmount: (cartId: string) => api.get(`/carts/${cartId}/cart/total`),
};

export const cartItemApi = {
  addItemToCart: (productId: string, quantity: number, cartId?: string) => api.post(`/cartItems/item/add?productId=${productId}&quantity=${quantity}${cartId ? `&cartId=${cartId}` : ''}`),
  removeItemFromCart: (cartId: string, productId: string) => api.delete(`/cartItems/cart/${cartId}/item/${productId}/remove`),
  updateItemQuantity: (cartId: string, productId: string, quantity: number) => api.put(`/cartItems/cart/${cartId}/item/${productId}/update?quantity=${quantity}`),
};

export const orderApi = {
  createOrder: (userId: string) => api.post(`/orders/order?userId=${userId}`),
  getOrderById: (orderId: string) => api.get(`/orders/${orderId}/order`),
  getUserOrders: (userId: string) => api.get(`/orders/${userId}/orders`),
};

export const imageApi = {
    uploadImages: (files: File[], productId: string) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        formData.append('productId', productId);
        return api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    downloadImage: (imageId: string) => api.get(`/images/image/download/${imageId}`, { responseType: 'blob' }),
    updateImage: (imageId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.put(`/images/image/${imageId}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteImage: (imageId: string) => api.delete(`/images/image/${imageId}/delete`),
};

export default api;