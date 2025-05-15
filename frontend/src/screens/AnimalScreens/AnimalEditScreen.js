import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Picker } from "react-native";
import apiClient from "../../services/apiClient";

const AnimalEditScreen = ({ route, navigation }) => {
  const { animalData } = route.params; // Recebe os dados do animal para edição
  const [animalId, setAnimalId] = useState("");

  // Campos do formulário
  const [tutorId, setTutorId] = useState(""); // Não editável aqui, mas necessário para referência
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [corPelagem, setCorPelagem] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [microchipId, setMicrochipId] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);
  // Não precisamos carregar a lista de tutores aqui, pois o tutor não é alterado na edição do animal.

  useEffect(() => {
    if (animalData) {
      setAnimalId(animalData.animal_id);
      setTutorId(animalData.tutor_id); // Guardar para referência, não para edição direta
      setNome(animalData.nome || "");
      setEspecie(animalData.especie || "");
      setRaca(animalData.raca || "");
      // Formatar a data para YYYY-MM-DD se ela existir
      if (animalData.data_nascimento) {
        const date = new Date(animalData.data_nascimento);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        setDataNascimento(`${year}-${month}-${day}`);
      } else {
        setDataNascimento("");
      }
      setSexo(animalData.sexo || "");
      setCorPelagem(animalData.cor_pelagem || "");
      setPesoKg(animalData.peso_kg != null ? animalData.peso_kg.toString() : "");
      setMicrochipId(animalData.microchip_id || "");
      setFotoUrl(animalData.foto_url || "");
      setObservacoes(animalData.observacoes || "");
    }
  }, [animalData]);

  const handleUpdateAnimal = async () => {
    if (!nome || !especie) {
      Alert.alert("Erro", "Nome do animal e Espécie são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const updatedAnimalData = {
        // tutor_id não é enviado para atualização, pois não deve ser alterado aqui.
        nome,
        especie,
        raca,
        data_nascimento: dataNascimento || null,
        sexo,
        cor_pelagem: corPelagem,
        peso_kg: pesoKg ? parseFloat(pesoKg) : null,
        microchip_id: microchipId,
        foto_url: fotoUrl,
        observacoes,
      };

      const response = await apiClient.put(`/animais/${animalId}`, updatedAnimalData);
      setLoading(false);
      Alert.alert("Sucesso", "Animal atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao atualizar animal:", error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Atualizar Animal", error.response?.data?.message || "Não foi possível atualizar o animal. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Animal</Text>

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
        <Button title="Salvar Alterações" onPress={handleUpdateAnimal} />
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 12,
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default AnimalEditScreen;

