
import { create } from "zustand";
import { persist } from "zustand/middleware";


export type CartItem = {
  id: string;
  title: string;
  price: number;
  oldprice: number;
  image: string;
  qty: number;
  category?: string;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  changeQty: (id: string, action: "inc" | "dec") => void; 
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exist = state.items.find((i) => i.id === item.id);
          if (exist) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
        changeQty: (id, action) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  qty: action === "inc" ? i.qty + 1 : Math.max(1, i.qty - 1),
                }
              : i
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "assaf-cart-storage",
    }
  )
);


type WishlistState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (!existingItem) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "assaf-wishlist-storage",
    }
  )
);