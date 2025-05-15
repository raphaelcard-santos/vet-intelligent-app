import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Picker } from "react-native"; // Adicionado Picker
import apiClient from "../../services/apiClient"; // Importa o apiClient
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenar o token

const RegisterScreen = ({ navigation }) => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("tutor"); // Valor inicial
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nomeCompleto || !email || !senha || !confirmarSenha || !tipoUsuario) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post("/usuarios/register", {
        nome_completo: nomeCompleto, // Backend espera nome_completo
        email,
        senha,
        tipo_usuario: tipoUsuario,
      });
      setLoading(false);
      console.log("Resposta do Cadastro:", response.data);
      Alert.alert(
        "Cadastro Bem-sucedido",
        "Seu cadastro foi realizado com sucesso! Você já pode fazer o login.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
      // Poderia armazenar o token aqui também se o backend retornasse um na criação
      // await AsyncStorage.setItem('userToken', response.data.token);
      // navigation.navigate('App'); // Ou navegar direto para o app
    } catch (error) {
      setLoading(false);
      console.error("Erro no Cadastro:", error.response ? error.response.data : error.message);
      Alert.alert("Erro no Cadastro", error.response?.data?.message || "Não foi possível realizar o cadastro. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
        editable={!loading}
      />
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
        placeholder="Senha (mínimo 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        editable={!loading}
      />
      <Text style={styles.label}>Eu sou:</Text>
      <Picker
        selectedValue={tipoUsuario}
        style={styles.picker} // Estilizar o Picker se necessário
        onValueChange={(itemValue, itemIndex) => setTipoUsuario(itemValue)}
        enabled={!loading}
      >
        <Picker.Item label="Tutor de Animal" value="tutor" />
        <Picker.Item label="Médico Veterinário" value="veterinario" />
        <Picker.Item label="Estudante de Veterinária" value="estudante" />
        <Picker.Item label="Representante de Clínica" value="clinica_admin" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Cadastrar" onPress={handleRegister} />
      )}
      <Button
        title="Já tem uma conta? Faça Login"
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    color: "gray",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 12,
    borderColor: "gray", // Estilo pode variar por plataforma
    borderWidth: 1,      // Estilo pode variar por plataforma
    borderRadius: 5,     // Estilo pode variar por plataforma
  }
});

export default RegisterScreen;

