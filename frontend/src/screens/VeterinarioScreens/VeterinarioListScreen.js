import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const VeterinarioListScreen = ({ navigation }) => {
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVeterinarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/veterinarios/');
      setVeterinarios(response.data);
    } catch (e) {
      console.error("Erro ao buscar veterinários:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar a lista de veterinários.');
      Alert.alert('Erro', 'Não foi possível carregar a lista de veterinários.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchVeterinarios();
      return () => {}; 
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome_completo}</Text>
      <Text style={styles.itemSubText}>CRMV: {item.crmv}</Text>
      {item.especialidades && <Text style={styles.itemSubText}>Especialidades: {JSON.parse(item.especialidades).join(', ')}</Text>}
      <View style={styles.buttonRow}>
        <Button title="Ver" onPress={() => navigation.navigate('VeterinarioDetail', { veterinarioId: item.veterinario_id })} />
      </View>
    </View>
  );

  if (loading && veterinarios.length === 0) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchVeterinarios} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Novo Veterinário"
        onPress={() => navigation.navigate('VeterinarioCreate')}
      />
      {veterinarios.length === 0 && !loading ? (
         <View style={styles.centeredMessage}>
            <Text>Nenhum veterinário cadastrado.</Text>
         </View>
      ) : (
        <FlatList
          data={veterinarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.veterinario_id.toString()}
          refreshing={loading}
          onRefresh={fetchVeterinarios}
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
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

export default VeterinarioListScreen;

