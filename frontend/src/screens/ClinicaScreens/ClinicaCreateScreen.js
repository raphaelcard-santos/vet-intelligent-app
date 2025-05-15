import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Picker } from "react-native";
import apiClient from "../../services/apiClient";

const ClinicaCreateScreen = ({ navigation }) => {
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [telefonePrincipal, setTelefonePrincipal] = useState("");
  const [emailPrincipal, setEmailPrincipal] = useState("");
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [servicosOferecidos, setServicosOferecidos] = useState(""); // String separada por vírgulas
  const [responsavelTecnicoId, setResponsavelTecnicoId] = useState("");
  const [fotoFachadaUrl, setFotoFachadaUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);
  const [veterinarios, setVeterinarios] = useState([]); // Para o Picker de responsável técnico
  const [loadingVeterinarios, setLoadingVeterinarios] = useState(false);

  // Carregar lista de veterinários para o Picker de Responsável Técnico
  useEffect(() => {
    const fetchVeterinarios = async () => {
      setLoadingVeterinarios(true);
      try {
        const response = await apiClient.get("/veterinarios/");
        setVeterinarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar veterinários para o formulário:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de veterinários.");
      }
      setLoadingVeterinarios(false);
    };
    fetchVeterinarios();
  }, []);

  const handleCreateClinica = async () => {
    if (!nomeFantasia || !cnpj) {
      Alert.alert("Erro", "Nome Fantasia e CNPJ são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const clinicaData = {
        nome_fantasia: nomeFantasia,
        razao_social: razaoSocial,
        cnpj,
        endereco_completo: enderecoCompleto,
        telefone_principal: telefonePrincipal,
        email_principal: emailPrincipal,
        horario_atendimento: horarioAtendimento,
        servicos_oferecidos: servicosOferecidos ? servicosOferecidos.split(",").map(s => s.trim()) : [],
        responsavel_tecnico_id: responsavelTecnicoId || null, // Enviar null se não selecionado
        foto_fachada_url: fotoFachadaUrl,
        website,
        observacoes,
      };
      const response = await apiClient.post("/clinicas/", clinicaData);
      setLoading(false);
      Alert.alert("Sucesso", "Clínica criada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao criar clínica:", error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Criar Clínica", error.response?.data?.message || "Não foi possível criar a clínica. Tente novamente.");
    }
  };

  if (loadingVeterinarios) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Nova Clínica</Text>

      <Text style={styles.label}>Nome Fantasia *</Text>
      <TextInput style={styles.input} placeholder="Nome fantasia da clínica" value={nomeFantasia} onChangeText={setNomeFantasia} editable={!loading} />
      
      <Text style={styles.label}>Razão Social</Text>
      <TextInput style={styles.input} placeholder="Razão social (opcional)" value={razaoSocial} onChangeText={setRazaoSocial} editable={!loading} />
      
      <Text style={styles.label}>CNPJ *</Text>
      <TextInput style={styles.input} placeholder="CNPJ da clínica" value={cnpj} onChangeText={setCnpj} keyboardType="numeric" editable={!loading} />
      
      <Text style={styles.label}>Endereço Completo</Text>
      <TextInput style={styles.input} placeholder="Endereço completo (opcional)" value={enderecoCompleto} onChangeText={setEnderecoCompleto} editable={!loading} />
      
      <Text style={styles.label}>Telefone Principal</Text>
      <TextInput style={styles.input} placeholder="Telefone (opcional)" value={telefonePrincipal} onChangeText={setTelefonePrincipal} keyboardType="phone-pad" editable={!loading} />

      <Text style={styles.label}>Email Principal</Text>
      <TextInput style={styles.input} placeholder="Email (opcional)" value={emailPrincipal} onChangeText={setEmailPrincipal} keyboardType="email-address" editable={!loading} />

      <Text style={styles.label}>Horário de Atendimento</Text>
      <TextInput style={styles.input} placeholder="Ex: Seg-Sex 08h-18h, Sab 08h-12h (opcional)" value={horarioAtendimento} onChangeText={setHorarioAtendimento} editable={!loading} />

      <Text style={styles.label}>Serviços Oferecidos</Text>
      <TextInput style={styles.input} placeholder="Ex: Consultas, Vacinas, Cirurgias (separado por vírgula)" value={servicosOferecidos} onChangeText={setServicosOferecidos} editable={!loading} />

      <Text style={styles.label}>Responsável Técnico (Veterinário)</Text>
      <Picker
        selectedValue={responsavelTecnicoId}
        style={styles.picker}
        onValueChange={(itemValue) => setResponsavelTecnicoId(itemValue)}
        enabled={!loading}
      >
        <Picker.Item label="Selecione um responsável técnico... (opcional)" value="" />
        {veterinarios.map((v) => (
          <Picker.Item key={v.veterinario_id} label={`${v.nome_completo} (CRMV: ${v.crmv})`} value={v.veterinario_id} />
        ))}
      </Picker>

      <Text style={styles.label}>URL da Foto da Fachada</Text>
      <TextInput style={styles.input} placeholder="URL da foto (opcional)" value={fotoFachadaUrl} onChangeText={setFotoFachadaUrl} editable={!loading} />

      <Text style={styles.label}>Website</Text>
      <TextInput style={styles.input} placeholder="Website da clínica (opcional)" value={website} onChangeText={setWebsite} editable={!loading} />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Observações adicionais (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        numberOfLines={3}
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Salvar Clínica" onPress={handleCreateClinica} />
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

export default ClinicaCreateScreen;

