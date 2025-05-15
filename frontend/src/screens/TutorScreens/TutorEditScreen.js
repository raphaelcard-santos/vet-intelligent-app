import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import apiClient from "../../services/apiClient";

const TutorEditScreen = ({ route, navigation }) => {
  const { tutorData } = route.params; // Recebe os dados do tutor para edição
  const [tutorId, setTutorId] = useState("");

  // Campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefonePrincipal, setTelefonePrincipal] = useState("");
  const [telefoneSecundario, setTelefoneSecundario] = useState("");
  const [enderecoRua, setEnderecoRua] = useState("");
  const [enderecoNumero, setEnderecoNumero] = useState("");
  const [enderecoComplemento, setEnderecoComplemento] = useState("");
  const [enderecoBairro, setEnderecoBairro] = useState("");
  const [enderecoCidade, setEnderecoCidade] = useState("");
  const [enderecoEstado, setEnderecoEstado] = useState("");
  const [enderecoCep, setEnderecoCep] = useState("");
  // usuario_id não deve ser editável aqui, pois é um vínculo estrutural.

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tutorData) {
      setTutorId(tutorData.tutor_id);
      setNomeCompleto(tutorData.nome_completo || "");
      setCpf(tutorData.cpf || "");
      setTelefonePrincipal(tutorData.telefone_principal || "");
      setTelefoneSecundario(tutorData.telefone_secundario || "");
      setEnderecoRua(tutorData.endereco_rua || "");
      setEnderecoNumero(tutorData.endereco_numero || "");
      setEnderecoComplemento(tutorData.endereco_complemento || "");
      setEnderecoBairro(tutorData.endereco_bairro || "");
      setEnderecoCidade(tutorData.endereco_cidade || "");
      setEnderecoEstado(tutorData.endereco_estado || "");
      setEnderecoCep(tutorData.endereco_cep || "");
    }
  }, [tutorData]);

  const handleUpdateTutor = async () => {
    if (!nomeCompleto || !telefonePrincipal) {
      Alert.alert("Erro", "Nome completo e telefone principal são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const updatedTutorData = {
        nome_completo: nomeCompleto,
        cpf,
        telefone_principal: telefonePrincipal,
        telefone_secundario: telefoneSecundario,
        endereco_rua: enderecoRua,
        endereco_numero: enderecoNumero,
        endereco_complemento: enderecoComplemento,
        endereco_bairro: enderecoBairro,
        endereco_cidade: enderecoCidade,
        endereco_estado: enderecoEstado,
        endereco_cep: enderecoCep,
      };
      // Remove campos nulos ou vazios para não sobrescrever com nada no backend (COALESCE trata isso no backend)
      // Object.keys(updatedTutorData).forEach(key => (updatedTutorData[key] == null || updatedTutorData[key] === 
') && delete updatedTutorData[key]);

      const response = await apiClient.put(`/tutores/${tutorId}`, updatedTutorData);
      setLoading(false);
      Alert.alert("Sucesso", "Tutor atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }, // Volta para a tela de detalhes ou lista
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao atualizar tutor:", error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Atualizar Tutor", error.response?.data?.message || "Não foi possível atualizar o tutor. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Tutor</Text>

      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput style={styles.input} placeholder="Nome Completo do Tutor" value={nomeCompleto} onChangeText={setNomeCompleto} editable={!loading} />
      
      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" editable={!loading} />
      
      <Text style={styles.label}>Telefone Principal *</Text>
      <TextInput style={styles.input} placeholder="Telefone Principal" value={telefonePrincipal} onChangeText={setTelefonePrincipal} keyboardType="phone-pad" editable={!loading} />
      
      <Text style={styles.label}>Telefone Secundário</Text>
      <TextInput style={styles.input} placeholder="Telefone Secundário" value={telefoneSecundario} onChangeText={setTelefoneSecundario} keyboardType="phone-pad" editable={!loading} />
      
      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} placeholder="Rua/Avenida" value={enderecoRua} onChangeText={setEnderecoRua} editable={!loading} />
      <TextInput style={styles.input} placeholder="Número" value={enderecoNumero} onChangeText={setEnderecoNumero} keyboardType="numeric" editable={!loading} />
      <TextInput style={styles.input} placeholder="Complemento" value={enderecoComplemento} onChangeText={setEnderecoComplemento} editable={!loading} />
      <TextInput style={styles.input} placeholder="Bairro" value={enderecoBairro} onChangeText={setEnderecoBairro} editable={!loading} />
      <TextInput style={styles.input} placeholder="Cidade" value={enderecoCidade} onChangeText={setEnderecoCidade} editable={!loading} />
      <TextInput style={styles.input} placeholder="Estado (UF)" value={enderecoEstado} onChangeText={setEnderecoEstado} maxLength={2} autoCapitalize="characters" editable={!loading} />
      <TextInput style={styles.input} placeholder="CEP" value={enderecoCep} onChangeText={setEnderecoCep} keyboardType="numeric" editable={!loading} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Salvar Alterações" onPress={handleUpdateTutor} />
      )}
      <Button title="Cancelar" onPress={() => navigation.goBack()} disabled={loading} color="gray" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "lightgray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
});

export default TutorEditScreen;

