import axios from 'axios';

// Cambia esta URL por la de tu backend real
const api = axios.create({
  baseURL: 'https://markora-backend.onrender.com', // 🛠️ Ajusta si es otro puerto o en Railway
  withCredentials: false, // Para cookies; ahora mismo no usamos
});

export default api;
