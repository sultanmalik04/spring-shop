import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  sub: string; // email
  roles: string[];
  iat: number;
  exp: number;
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwtToken');
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  return null;
};

export const getUserRoles = (): string[] => {
  const token = getAuthToken();
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.roles || [];
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return [];
    }
  }
  return [];
};

export const isAdmin = (): boolean => {
  const roles = getUserRoles();
  return roles.includes('ROLE_ADMIN');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime; // Check if token is not expired
    } catch (error) {
      return false; // Invalid token
    }
  }
  return false;
};
