import { useState, useEffect, useCallback, useMemo } from 'react';

// Definim un tip de bază pentru obiectele din coș (ajută la autocompletion)
export interface CartItem {
  id: string;
  cartItemId?: string; // Cheie unică în coș (pentru a diferenția notele)
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  [key: string]: any; // Permite și alte câmpuri opționale
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Încărcăm coșul din localStorage la prima rulare (Mount)
  useEffect(() => {
    const savedCart = localStorage.getItem('active_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Eroare la parsarea coșului din storage", e);
      }
    }
  }, []);

  // 2. Salvăm automat în localStorage ori de câte ori se schimbă coșul
  useEffect(() => {
    localStorage.setItem('active_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Adăugare produs (sau incrementare dacă există deja cu ACELEAȘI notițe)
  const addToCart = useCallback((product: any, notes: string = "") => {
    setCart((prev) => {
      const targetCartItemId = `${product.id}-${notes.trim().toLowerCase()}`;

      const existingItemIndex = prev.findIndex((item) => (item.cartItemId || item.id) === targetCartItemId || (item.id === product.id && (item.notes||"") === notes));
      
      if (existingItemIndex >= 0) {
        return prev.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, notes, cartItemId: targetCartItemId }];
    });
  }, []);

  // 4. Modificare cantitate (+1 / -1) bazat pe cartItemId unic (sau id fallback)
  const updateQuantity = useCallback((cartItemIdOrId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.cartItemId || item.id) === cartItemIdOrId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  // 5. Golire coș (după ce comanda a fost trimisă cu succes)
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('active_cart');
  }, []);

  // 6. Calcule (Memoizate pentru performanță - se recalculează doar când se schimbă cart)
  const totalAmount = useMemo(() => 
    cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
  , [cart]);

  const totalItems = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0)
  , [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  };
}