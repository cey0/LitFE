export const state = () => ({
  cart: [],
});

export const mutations = {
  addToCart(state, book) {
    state.cart.push(book);
  },
  removeFromCart(state, bookId) {
    state.cart = state.cart.filter(item => item.id !== bookId);
  },
  clearCart(state) {
    state.cart = [];
  },
};

export const getters = {
  cartItems: (state) => state.cart,
  cartCount: (state) => state.cart.length,
}; 