import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { obterDiagnosticoIA } from '../../services/apiClient'; // Importar a função da API

// Placeholder para informações do animal (será buscado ou recebido por navegação)
const mockAnimalInfo = {
  id: '1', // Recebido via params
  nome: 'Rex',
  especie: 'Cão',
  raca: 'Labrador',
  idade: '3 anos',
};

const DiagnosticoInputScreen = ({ route, navigation }) => {
  // const { animalId } = route.params; // Descomentar quando a navegação estiver integrada
  const animalId = mockAnimalInfo.id; // Usando mock por enquanto

  const [animalInfo, setAnimalInfo] = useState(null);
  const [sintomas, setSintomas] = useState(''); // Campo de texto para sintomas
  const [observacoes, setObservacoes] = useState('');
  const [isLoadingAnimal, setIsLoadingAnimal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simular busca de dados do animal
    // TODO: Substituir por busca real ou usar dados passados via navegação
    setIsLoadingAnimal(true);
    setTimeout(() => {
      if (animalId === mockAnimalInfo.id) {
        setAnimalInfo(mockAnimalInfo);
      } else {
        Alert.alert('Erro', 'Animal não encontrado.');
        // navigation.goBack(); // Descomentar
      }
      setIsLoadingAnimal(false);
    }, 500);
  }, [animalId]);

  const handleSubmeterDiagnostico = async () => {
    const sintomasArray = sintomas.split('\n').map(s => s.trim()).filter(s => s); // Transforma texto em array, removendo linhas vazias

    if (sintomasArray.length === 0) {
      Alert.alert('Entrada Inválida', 'Por favor, descreva ao menos um sintoma.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Enviando para API:', { animalId, sintomas: sintomasArray, observacoesAdicionais: observacoes });
      const resultado = await obterDiagnosticoIA(animalId, sintomasArray, observacoes);
      console.log('Resultado da API:', resultado);

      // Navegar para a tela de resultados passando os dados recebidos
      navigation.navigate('DiagnosticoResult', { resultado }); // TODO: Criar DiagnosticoResultScreen

    } catch (error) {
      console.error("Erro detalhado na tela:", error);
      Alert.alert('Erro ao Obter Diagnóstico', error.message || 'Não foi possível obter as sugestões de diagnóstico. Verifique sua conexão ou tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAnimal) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" /></View>
    );
  }

  if (!animalInfo) {
    return <View style={styles.centered}><Text>Erro ao carregar dados do animal.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Diagnóstico por IA</Text>

      <View style={styles.animalInfoContainer}>
        <Text style={styles.label}>Animal Selecionado:</Text>
        <Text>{animalInfo.nome} ({animalInfo.especie} - {animalInfo.raca}, {animalInfo.idade})</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sintomas Observados:</Text>
        <Text style={styles.hint}>(Descreva um sintoma por linha)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Vômito\nFebre\nApatia"
          value={sintomas}
          onChangeText={setSintomas}
          multiline
          numberOfLines={5}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Observações Adicionais:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Não come há 1 dia, bebeu muita água..."
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={3}
        />
      </View>

      <Button
        title={isSubmitting ? 'Enviando...' : 'Obter Sugestão de Diagnóstico'}
        onPress={handleSubmeterDiagnostico}
        disabled={isSubmitting || isLoadingAnimal}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', // Cor de fundo suave
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  animalInfoContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // Semi-bold
    marginBottom: 8,
    color: '#495057',
  },
  hint: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100, // Altura mínima
    textAlignVertical: 'top',
  },
});

export default DiagnosticoInputScreen;

