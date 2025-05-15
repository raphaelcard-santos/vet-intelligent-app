import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native'; // To refresh data on screen focus

const TutorListScreen = ({ navigation }) => {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTutores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/tutores/');
      setTutores(response.data);
    } catch (e) {
      console.error("Erro ao buscar tutores:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar a lista de tutores.');
      Alert.alert('Erro', 'Não foi possível carregar a lista de tutores.');
    }
    setLoading(false);
  };

  // useFocusEffect para recarregar os dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchTutores();
      return () => {}; // Função de limpeza opcional
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome_completo}</Text>
      <Text style={styles.itemSubText}>{item.usuario_email || 'Email não disponível'}</Text>
      <View style={styles.buttonRow}>
        <Button title="Ver" onPress={() => navigation.navigate('TutorDetail', { tutorId: item.tutor_id })} />
        {/* Adicionar botões para Editar e Deletar futuramente */}
      </View>
    </View>
  );

  if (loading && tutores.length === 0) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchTutores} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Novo Tutor"
        onPress={() => navigation.navigate('TutorCreate')}
      />
      {tutores.length === 0 && !loading ? (
         <View style={styles.centeredMessage}>
            <Text>Nenhum tutor cadastrado.</Text>
         </View>
      ) : (
        <FlatList
          data={tutores}
          renderItem={renderItem}
          keyExtractor={(item) => item.tutor_id.toString()}
          refreshing={loading}
          onRefresh={fetchTutores} // Permite puxar para atualizar
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

export default TutorListScreen;

