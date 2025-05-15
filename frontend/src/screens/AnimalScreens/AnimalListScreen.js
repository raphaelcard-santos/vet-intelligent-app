import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const AnimalListScreen = ({ navigation, route }) => {
  // Opcional: Receber tutorId para filtrar animais de um tutor específico
  const tutorId = route.params?.tutorId;

  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnimais = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/animais/';
      if (tutorId) {
        url = `/animais/?tutorId=${tutorId}`; // Backend deve suportar este filtro
      }
      const response = await apiClient.get(url);
      setAnimais(response.data);
    } catch (e) {
      console.error("Erro ao buscar animais:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar a lista de animais.');
      Alert.alert('Erro', 'Não foi possível carregar a lista de animais.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnimais();
      return () => {}; 
    }, [tutorId]) // Recarregar se tutorId mudar (ex: vindo de diferentes telas de tutor)
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome} ({item.especie})</Text>
      <Text style={styles.itemSubText}>Tutor: {item.nome_tutor || 'Não informado'}</Text>
      <View style={styles.buttonRow}>
        <Button title="Ver" onPress={() => navigation.navigate('AnimalDetail', { animalId: item.animal_id })} />
        {/* Adicionar botões para Editar e Deletar futuramente */}
      </View>
    </View>
  );

  if (loading && animais.length === 0) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchAnimais} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Novo Animal"
        onPress={() => navigation.navigate('AnimalCreate', { tutorId: tutorId })} // Passar tutorId se disponível
      />
      {animais.length === 0 && !loading ? (
         <View style={styles.centeredMessage}>
            <Text>Nenhum animal cadastrado{tutorId ? ' para este tutor' : ''}.</Text>
         </View>
      ) : (
        <FlatList
          data={animais}
          renderItem={renderItem}
          keyExtractor={(item) => item.animal_id.toString()}
          refreshing={loading}
          onRefresh={fetchAnimais}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubText: {
    fontSize: 14,
    color: 'gray',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

export default AnimalListScreen;

