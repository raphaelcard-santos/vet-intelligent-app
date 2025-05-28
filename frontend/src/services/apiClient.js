import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para buscar o token

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

// Interceptor para adicionar o token de autenticação em todas as requisições
apiClient.interceptors.request.use(
  async (config) => {
    // Usaremos um token simulado por enquanto para a API de diagnóstico
    // Em um cenário real, buscaríamos o token do AsyncStorage
    // const token = await AsyncStorage.getItem('userToken');
    const token = 'SIMULATED_TOKEN'; // Token simulado para testes

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função específica para a API de Diagnóstico com IA
export const obterDiagnosticoIA = async (animalId, sintomas, observacoesAdicionais) => {
  try {
    const response = await apiClient.post('/diagnostico', {
      animalId,
      sintomas, // Espera-se que seja um array de strings
      observacoesAdicionais,
    });
    return response.data; // Retorna os dados da resposta (sugestões, disclaimer, etc.)
  } catch (error) {
    console.error('Erro ao chamar API de diagnóstico:', error.response?.data || error.message);
    // Re-lança o erro para ser tratado na tela
    throw error.response?.data || new Error('Erro ao conectar com a API de diagnóstico');
  }
};


export default apiClient;

