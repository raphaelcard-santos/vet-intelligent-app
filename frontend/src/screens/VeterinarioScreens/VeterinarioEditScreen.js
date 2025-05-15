import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import apiClient from "../../services/apiClient";

const VeterinarioEditScreen = ({ route, navigation }) => {
  const { veterinarioData } = route.params; // Recebe os dados do veterinário para edição
  const [veterinarioId, setVeterinarioId] = useState("");

  // Campos do formulário
  // usuario_id não é editável aqui, mas pode ser exibido se necessário.
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [crmv, setCrmv] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  const [telefoneContato, setTelefoneContato] = useState("");
  const [emailContato, setEmailContato] = useState("");
  const [bioCurta, setBioCurta] = useState("");
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (veterinarioData) {
      setVeterinarioId(veterinarioData.veterinario_id);
      setNomeCompleto(veterinarioData.nome_completo || "");
      setCpf(veterinarioData.cpf || "");
      setCrmv(veterinarioData.crmv || "");
      setEspecialidades(veterinarioData.especialidades ? JSON.parse(veterinarioData.especialidades).join(", ") : "");
      setTelefoneContato(veterinarioData.telefone_contato || "");
      setEmailContato(veterinarioData.email_contato || "");
      setBioCurta(veterinarioData.bio_curta || "");
      setFotoPerfilUrl(veterinarioData.foto_perfil_url || "");
    }
  }, [veterinarioData]);

  const handleUpdateVeterinario = async () => {
    if (!nomeCompleto || !crmv) {
      Alert.alert("Erro", "Nome Completo e CRMV são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const updatedVetData = {
        nome_completo: nomeCompleto,
        cpf,
        crmv,
        especialidades: especialidades ? especialidades.split(",").map(e => e.trim()) : [],
        telefone_contato: telefoneContato,
        email_contato: emailContato,
        bio_curta: bioCurta,
        foto_perfil_url: fotoPerfilUrl,
      };

      const response = await apiClient.put(`/veterinarios/${veterinarioId}`, updatedVetData);
      setLoading(false);
      Alert.alert("Sucesso", "Veterinário atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao atualizar veterinário:", error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Atualizar Veterinário", error.response?.data?.message || "Não foi possível atualizar o veterinário. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Veterinário</Text>

      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput style={styles.input} placeholder="Nome completo do veterinário" value={nomeCompleto} onChangeText={setNomeCompleto} editable={!loading} />
      
      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} placeholder="CPF (opcional)" value={cpf} onChangeText={setCpf} keyboardType="numeric" editable={!loading} />
      
      <Text style={styles.label}>CRMV *</Text>
      <TextInput style={styles.input} placeholder="Número do CRMV" value={crmv} onChangeText={setCrmv} editable={!loading} />
      
      <Text style={styles.label}>Especialidades</Text>
      <TextInput style={styles.input} placeholder="Ex: Clínica Geral, Cirurgia (separado por vírgula)" value={especialidades} onChangeText={setEspecialidades} editable={!loading} />
      
      <Text style={styles.label}>Telefone de Contato</Text>
      <TextInput style={styles.input} placeholder="Telefone (opcional)" value={telefoneContato} onChangeText={setTelefoneContato} keyboardType="phone-pad" editable={!loading} />

      <Text style={styles.label}>Email de Contato</Text>
      <TextInput style={styles.input} placeholder="Email (opcional)" value={emailContato} onChangeText={setEmailContato} keyboardType="email-address" editable={!loading} />

      <Text style={styles.label}>Bio Curta</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Uma breve descrição profissional (opcional)" value={bioCurta} onChangeText={setBioCurta} multiline numberOfLines={3} editable={!loading} />

      <Text style={styles.label}>URL da Foto de Perfil</Text>
      <TextInput style={styles.input} placeholder="URL da foto (opcional)" value={fotoPerfilUrl} onChangeText={setFotoPerfilUrl} editable={!loading} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Salvar Alterações" onPress={handleUpdateVeterinario} />
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
});

export default VeterinarioEditScreen;

