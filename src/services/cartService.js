import api from "../api/axios";

export const cartService = {
  getCart: (userId) => api.get(`/carts/user/${userId}`).then((r) => r.data),
  addItem: (cartId, productId, quantity) =>
    api.post("/cart-items", { cartId, productId, quantity }).then((r) => r.data),
  removeItem: (itemId) => api.delete(`/cart-items/${itemId}`).then((r) => r.data),
  updateItem: (itemId, quantity) =>
    api.put(`/cart-items/${itemId}`, { quantity }).then((r) => r.data),
};