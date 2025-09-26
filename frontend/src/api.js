import axios from 'axios';

// Cria uma instância do axios com configurações base
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // A URL base da sua API Django
  headers: {
    'Content-Type': 'application/json',
  },
});

// Este é o "interceptador". Ele executa antes de cada requisição.
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Se o token existir, adiciona ao cabeçalho de autorização
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);

export default apiClient;