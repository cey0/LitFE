import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Daftar item di keranjang
  }),
  getters: {
    cartCount: (state) => state.items.length, // Menghitung jumlah item di keranjang
  },
  actions: {
    addToCart(item) {
      this.items.push(item); // Menambahkan item ke cart
    },
    removeFromCart(itemId) {
      this.items = this.items.filter(item => item.id !== itemId); // Menghapus item dari cart
    },
  },
});
