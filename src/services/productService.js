import api from "../api/axios";

export const productService = {
  // Récupère tous les produits actifs
  getAll: () => api.get("/products").then((r) => r.data),

  // Récupère un produit spécifique par son ID
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data),

  // Récupère les produits d'une catégorie spécifique
  getByCategory: (categoryName) => 
    api.get(`/products/category/${categoryName}`).then((r) => r.data),

  // Recherche avec mots-clés et optionnellement par catégorie
  search: (keyword, category = "") => {
    const params = new URLSearchParams({ keyword });
    if (category) params.append("category", category);
    return api.get(`/products/search?${params.toString()}`).then((r) => r.data);
  },

  // Filtre par plage de prix
  filterByPrice: (min, max) => 
    api.get(`/products/filter?minPrice=${min}&maxPrice=${max}`).then((r) => r.data),

  // Synchronisation avec FakeStore (Utile pour ton bouton d'admin)
  sync: () => api.post("/products/sync").then((r) => r.data),
  // Create product (fallback depends on API)
  create: (product) => api.post('/products', product).then(r => r.data),
  // Update product
  update: (id, updates) => api.put(`/products/${id}`, updates).then(r => r.data),
  // Delete product
  remove: (id) => api.delete(`/products/${id}`).then(r => r.data),
};