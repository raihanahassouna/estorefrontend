import api from "../api/axios";

export const categoryService = {
  getAll: () => api.get("/category").then((r) => r.data),
  getById: (id) => api.get(`/category/${id}`).then((r) => r.data),
  getByName: (name) => api.get(`/category/name/${name}`).then((r) => r.data),
};