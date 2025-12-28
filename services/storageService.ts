
import { Order } from '../types';

const ORDERS_KEY = 'milana_orders';
const WISHLIST_KEY = 'milana_wishlist';

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order); // Add to top
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const updateOrder = (updatedOrder: Order): void => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = updatedOrder;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
};

export const getWishlist = (): string[] => {
  const stored = localStorage.getItem(WISHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveWishlist = (wishlist: string[]): void => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};
