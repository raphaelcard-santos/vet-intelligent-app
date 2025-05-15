import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Picker } from "react-native";
import apiClient from "../../services/apiClient";

const VeterinarioCreateScreen = ({ navigation }) => {
  const [usuarioId, setUsuarioId] = useState(""); // Este campo precisará ser preenchido com um usuário existente que não seja veterinário ainda.
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [crmv, setCrmv] = useState("");
  const [especialidades, setEspecialidades] = useState(""); // String separada por vírgulas, ex: "Clínica Geral, Cirurgia"
  const [telefoneContato, setTelefoneContato] = useState("");
  const [emailContato, setEmailContato] = useState("");
  const [bioCurta, setBioCurta] = useState("");
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  // Carregar lista de usuários (que ainda não são veterinários) para o Picker
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoadingUsuarios(true);
      try {
        // Idealmente, o backend deveria fornecer uma rota para listar usuários elegíveis
        const response = await apiClient.get("/usuarios/"); // Ajustar esta rota conforme necessário
        // Filtrar usuários que já não têm um perfil de veterinário associado (isso é uma simplificação)
        setUsuarios(response.data.filter(u => !u.veterinario_id_ref)); // Supondo que `veterinario_id_ref` exista no modelo Usuario
      } catch (error) {
        console.error("Erro ao buscar usuários para o formulário:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
      }
      setLoadingUsuarios(false);
    };
    fetchUsuarios();
  }, []);


  const handleCreateVeterinario = async () => {
    if (!usuarioId || !nomeCompleto || !crmv) {
      Alert.alert("Erro", "Usuário, Nome Completo e CRMV são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const vetData = {
        usuario_id: usuarioId,
        nome_completo: nomeCompleto,
        cpf,
        crmv,
        especialidades: especialidades ? especialidades.split(",").map(e => e.trim()) : [],
        telefone_contato: telefoneContato,
        email_contato: emailContato,
        bio_curta: bioCurta,
        foto_perfil_url: fotoPerfilUrl,
      };
      const response = await apiClient.post("/veterinarios/", vetData);
      setLoading(false);
      Alert.alert("Sucesso", "Veterinário criado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao criar veterinário:", error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Criar Veterinário", error.response?.data?.message || "Não foi possível criar o veterinário. Tente novamente.");
    }
  };

  if (loadingUsuarios) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Veterinário</Text>

      <Text style={styles.label}>Usuário Vinculado *</Text>
      <Picker
        selectedValue={usuarioId}
        style={styles.picker}
        onValueChange={(itemValue) => setUsuarioId(itemValue)}
        enabled={!loading}
      >
        <Picker.Item label="Selecione um usuário..." value="" />
        {usuarios.map((u) => (
          <Picker.Item key={u.usuario_id} label={`${u.nome_completo || u.email} (ID: ${u.usuario_id.substring(0,8)})`} value={u.usuario_id} />
        ))}
      </Picker>

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
        <Button title="Salvar Veterinário" onPress={handleCreateVeterinario} />
      )}
      <Button title="Cancelar" onPress={() => navigation.goBack()} disabled={loading} color="gray" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 12,
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default VeterinarioCreateScreen;

