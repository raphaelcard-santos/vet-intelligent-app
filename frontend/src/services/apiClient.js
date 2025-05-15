import axios from 'axios';

// Defina a URL base da sua API backend.
// Se estiver rodando o backend localmente para desenvolvimento com Expo Go no celular,
// use o endereço IP da sua máquina na rede local, não 'localhost'.
// Exemplo: const API_URL = 'http://192.168.1.10:3001/api';
const API_URL = 'http://localhost:3001/api'; // Ajuste se necessário

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

