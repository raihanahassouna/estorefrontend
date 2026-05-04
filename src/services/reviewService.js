import api from "../api/axios";
export const reviewService = {
  // Récupérer les avis d'un produit
  getByProduct: (productId) => 
    api.get(`/reviews/product/${productId}`).then((r) => r.data),

  // Récupérer la note moyenne
  getAverageRating: (productId) => 
    api.get(`/reviews/product/${productId}/rating`).then((r) => r.data),

  // Poster un nouvel avis
  create: (reviewData) => 
    api.post("/reviews", reviewData).then((r) => r.data),
};