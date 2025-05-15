import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const AnimalDetailScreen = ({ route, navigation }) => {
  const { animalId } = route.params;
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnimalDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/animais/${animalId}`);
      setAnimal(response.data);
    } catch (e) {
      console.error("Erro ao buscar detalhes do animal:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar os detalhes do animal.');
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do animal.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (animalId) {
        fetchAnimalDetails();
      }
      return () => {}; 
    }, [animalId])
  );

  const handleDeleteAnimal = async () => {
    Alert.alert(
      "Confirmar Deleção",
      `Você tem certeza que deseja deletar o animal ${animal?.nome}? Esta ação não pode ser desfeita.`, 
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: async () => {
            setLoading(true);
            try {
              await apiClient.delete(`/animais/${animalId}`);
              setLoading(false);
              Alert.alert("Sucesso", "Animal deletado com sucesso!");
              navigation.goBack(); 
            } catch (e) {
              setLoading(false);
              console.error("Erro ao deletar animal:", e.response ? e.response.data : e.message);
              Alert.alert("Erro ao Deletar", e.response?.data?.message || "Não foi possível deletar o animal.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchAnimalDetails} />
      </View>
    );
  }

  if (!animal) {
    return (
        <View style={styles.centeredMessage}>
            <Text>Nenhum detalhe de animal encontrado.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {animal.foto_url ? (
        <Image source={{ uri: animal.foto_url }} style={styles.animalImage} onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>Sem foto</Text>
        </View>
      )}
      <Text style={styles.title}>{animal.nome}</Text>
      
      <View style={styles.detailItem}>
        <Text style={styles.label}>Tutor:</Text>
        <Text style={styles.value}>{animal.nome_tutor || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Espécie:</Text>
        <Text style={styles.value}>{animal.especie}</Text>
      </View>
      {animal.raca && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Raça:</Text>
          <Text style={styles.value}>{animal.raca}</Text>
        </View>
      )}
      {animal.data_nascimento && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Data de Nascimento:</Text>
          <Text style={styles.value}>{new Date(animal.data_nascimento).toLocaleDateString()}</Text>
        </View>
      )}
      {animal.sexo && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Sexo:</Text>
          <Text style={styles.value}>{animal.sexo}</Text>
        </View>
      )}
      {animal.cor_pelagem && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Cor/Pelagem:</Text>
          <Text style={styles.value}>{animal.cor_pelagem}</Text>
        </View>
      )}
      {animal.peso_kg != null && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{animal.peso_kg} kg</Text>
        </View>
      )}
      {animal.microchip_id && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Microchip ID:</Text>
          <Text style={styles.value}>{animal.microchip_id}</Text>
        </View>
      )}
      {animal.observacoes && (
        <View style={styles.detailItemFullWidth}>
          <Text style={styles.label}>Observações:</Text>
          <Text style={styles.valueFullWidth}>{animal.observacoes}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button 
            title="Editar Animal" 
            onPress={() => navigation.navigate('AnimalEdit', { animalData: animal })} 
            disabled={loading}
        />
        <Button 
            title="Deletar Animal" 
            onPress={handleDeleteAnimal} 
            color="red" 
            disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  animalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItemFullWidth: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    flexShrink: 1, 
    textAlign: 'right',
  },
  valueFullWidth: {
    fontSize: 16,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AnimalDetailScreen;

