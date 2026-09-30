"use client";

import { createContext, useContext, useReducer, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string; color: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; size: string; color: string; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { ...state, items: newItems };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color)
        ),
      };
    case "UPDATE_QUANTITY": {
      const { id, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string, size: string, color: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id, size, color } });
  const updateQuantity = (id: string, size: string, color: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, color, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => setIsOpen((prev) => !prev);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}