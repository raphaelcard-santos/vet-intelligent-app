import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../../services/apiClient'; // Importa o apiClient

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, informe seu email de cadastro.');
      return;
    }
    setLoading(true);
    try {
      // Supondo que o backend tenha uma rota /api/usuarios/forgot-password
      const response = await apiClient.post('/usuarios/forgot-password', { email });
      setLoading(false);
      Alert.alert(
        'Verifique seu Email',
        response.data.message || 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      setLoading(false);
      console.error('Erro ao solicitar recuperação de senha:', error.response ? error.response.data : error.message);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível processar sua solicitação. Tente novamente mais tarde.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu Email de Cadastro"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Enviar Link de Recuperação" onPress={handleSendLink} />
      )}
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
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

export default ForgotPasswordScreen;

