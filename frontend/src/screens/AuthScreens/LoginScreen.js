import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../../services/apiClient'; // Importa o apiClient
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenar o token

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/usuarios/login', {
        email,
        senha,
      });
      setLoading(false);
      console.log('Resposta do Login:', response.data);
      Alert.alert('Login Bem-sucedido', `Token: ${response.data.token}`);
      // Armazenar o token (ex: AsyncStorage)
      // await AsyncStorage.setItem('userToken', response.data.token);
      // Navegar para a tela principal do app
      // navigation.navigate('App'); // Descomentar quando a navegação principal estiver pronta
    } catch (error) {
      setLoading(false);
      console.error('Erro no Login:', error.response ? error.response.data : error.message);
      Alert.alert('Erro no Login', error.response?.data?.message || 'Não foi possível fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
      <Button
        title="Não tem uma conta? Cadastre-se"
        onPress={() => navigation.navigate('Register')}
        disabled={loading}
      />
      <Button
        title="Esqueceu sua senha?"
        onPress={() => navigation.navigate('ForgotPassword')}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;

