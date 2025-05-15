import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const ClinicaListScreen = ({ navigation }) => {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClinicas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/clinicas/');
      setClinicas(response.data);
    } catch (e) {
      console.error("Erro ao buscar clínicas:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar a lista de clínicas.');
      Alert.alert('Erro', 'Não foi possível carregar a lista de clínicas.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchClinicas();
      return () => {}; 
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome_fantasia}</Text>
      <Text style={styles.itemSubText}>CNPJ: {item.cnpj}</Text>
      {item.telefone_principal && <Text style={styles.itemSubText}>Telefone: {item.telefone_principal}</Text>}
      <View style={styles.buttonRow}>
        <Button title="Ver" onPress={() => navigation.navigate('ClinicaDetail', { clinicaId: item.clinica_id })} />
      </View>
    </View>
  );

  if (loading && clinicas.length === 0) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchClinicas} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Nova Clínica"
        onPress={() => navigation.navigate('ClinicaCreate')}
      />
      {clinicas.length === 0 && !loading ? (
         <View style={styles.centeredMessage}>
            <Text>Nenhuma clínica cadastrada.</Text>
         </View>
      ) : (
        <FlatList
          data={clinicas}
          renderItem={renderItem}
          keyExtractor={(item) => item.clinica_id.toString()}
          refreshing={loading}
          onRefresh={fetchClinicas}
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

export default ClinicaListScreen;

