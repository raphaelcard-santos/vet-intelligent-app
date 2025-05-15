import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Picker } from "react-native";
import apiClient from "../../services/apiClient";

const AnimalCreateScreen = ({ navigation, route }) => {
  const preselectedTutorId = route.params?.tutorId; // Se vier da tela de um tutor específico

  const [tutorId, setTutorId] = useState(preselectedTutorId || "");
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState(""); // Ex: Cão, Gato
  const [raca, setRaca] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); // Formato YYYY-MM-DD
  const [sexo, setSexo] = useState(""); // Ex: Macho, Fêmea
  const [corPelagem, setCorPelagem] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [microchipId, setMicrochipId] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);
  const [tutores, setTutores] = useState([]); // Para o Picker de tutores
  const [loadingTutores, setLoadingTutores] = useState(false);

  // Carregar lista de tutores para o Picker
  useEffect(() => {
    const fetchTutores = async () => {
      setLoadingTutores(true);
      try {
        const response = await apiClient.get("/tutores/");
        setTutores(response.data);
        if (response.data.length > 0 && !preselectedTutorId) {
            // Se não houver tutor pré-selecionado, define o primeiro da lista como padrão
            // setTutorId(response.data[0].tutor_id);
        }
      } catch (error) {
        console.error("Erro ao buscar tutores para o formulário:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de tutores.");
      }
      setLoadingTutores(false);
    };
    fetchTutores();
  }, []);

  const handleCreateAnimal = async () => {
    if (!tutorId || !nome || !especie) {
      Alert.alert("Erro", "Tutor, Nome do animal e Espécie são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const animalData = {
        tutor_id: tutorId,
        nome,
        especie,
        raca,
        data_nascimento: dataNascimento || null, // Enviar null se vazio
        sexo,
        cor_pelagem: corPelagem,
        peso_kg: pesoKg ? parseFloat(pesoKg) : null,
        microchip_id: microchipId,
        foto_url: fotoUrl,
        observacoes,
      };
      const response = await apiClient.post("/animais/", animalData);
      setLoading(false);
      Alert.alert("Sucesso", "Animal criado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao criar animal:", error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Criar Animal", error.response?.data?.message || "Não foi possível criar o animal. Tente novamente.");
    }
  };

  if (loadingTutores) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Animal</Text>

      <Text style={styles.label}>Tutor Responsável *</Text>
      <Picker
        selectedValue={tutorId}
        style={styles.picker}
        onValueChange={(itemValue) => setTutorId(itemValue)}
        enabled={!loading && !preselectedTutorId} // Desabilitar se tutorId veio por parâmetro
      >
        <Picker.Item label="Selecione um tutor..." value="" />
        {tutores.map((t) => (
          <Picker.Item key={t.tutor_id} label={t.nome_completo} value={t.tutor_id} />
        ))}
      </Picker>

      <Text style={styles.label}>Nome do Animal *</Text>
      <TextInput style={styles.input} placeholder="Nome do Animal" value={nome} onChangeText={setNome} editable={!loading} />
      
      <Text style={styles.label}>Espécie *</Text>
      <TextInput style={styles.input} placeholder="Ex: Cão, Gato, Pássaro" value={especie} onChangeText={setEspecie} editable={!loading} />
      
      <Text style={styles.label}>Raça</Text>
      <TextInput style={styles.input} placeholder="Ex: Labrador, Siamês (opcional)" value={raca} onChangeText={setRaca} editable={!loading} />
      
      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD (opcional)" value={dataNascimento} onChangeText={setDataNascimento} editable={!loading} />
      
      <Text style={styles.label}>Sexo</Text>
      <Picker
        selectedValue={sexo}
        style={styles.picker}
        onValueChange={(itemValue) => setSexo(itemValue)}
        enabled={!loading}
      >
        <Picker.Item label="Selecione o sexo... (opcional)" value="" />
        <Picker.Item label="Macho" value="Macho" />
        <Picker.Item label="Fêmea" value="Fêmea" />
        <Picker.Item label="Não Sabido" value="Não Sabido" />
      </Picker>

      <Text style={styles.label}>Cor/Pelagem</Text>
      <TextInput style={styles.input} placeholder="Cor da pelagem (opcional)" value={corPelagem} onChangeText={setCorPelagem} editable={!loading} />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput style={styles.input} placeholder="Peso em kg (opcional)" value={pesoKg} onChangeText={setPesoKg} keyboardType="numeric" editable={!loading} />

      <Text style={styles.label}>Microchip ID</Text>
      <TextInput style={styles.input} placeholder="Número do microchip (opcional)" value={microchipId} onChangeText={setMicrochipId} editable={!loading} />

      <Text style={styles.label}>URL da Foto</Text>
      <TextInput style={styles.input} placeholder="URL da foto do animal (opcional)" value={fotoUrl} onChangeText={setFotoUrl} editable={!loading} />

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
        <Button title="Salvar Animal" onPress={handleCreateAnimal} />
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
    textAlignVertical: "top", // Para Android
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

export default AnimalCreateScreen;

