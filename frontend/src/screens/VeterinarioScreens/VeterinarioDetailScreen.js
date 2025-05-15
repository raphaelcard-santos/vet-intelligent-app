import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const VeterinarioDetailScreen = ({ route, navigation }) => {
  const { veterinarioId } = route.params;
  const [veterinario, setVeterinario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVeterinarioDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/veterinarios/${veterinarioId}`);
      setVeterinario(response.data);
    } catch (e) {
      console.error("Erro ao buscar detalhes do veterinário:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar os detalhes do veterinário.');
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do veterinário.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (veterinarioId) {
        fetchVeterinarioDetails();
      }
      return () => {}; 
    }, [veterinarioId])
  );

  const handleDeleteVeterinario = async () => {
    Alert.alert(
      "Confirmar Deleção",
      `Você tem certeza que deseja deletar o veterinário ${veterinario?.nome_completo}? Esta ação não pode ser desfeita.`, 
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
              await apiClient.delete(`/veterinarios/${veterinarioId}`);
              setLoading(false);
              Alert.alert("Sucesso", "Veterinário deletado com sucesso!");
              navigation.goBack(); 
            } catch (e) {
              setLoading(false);
              console.error("Erro ao deletar veterinário:", e.response ? e.response.data : e.message);
              Alert.alert("Erro ao Deletar", e.response?.data?.message || "Não foi possível deletar o veterinário.");
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
        <Button title="Tentar Novamente" onPress={fetchVeterinarioDetails} />
      </View>
    );
  }

  if (!veterinario) {
    return (
        <View style={styles.centeredMessage}>
            <Text>Nenhum detalhe de veterinário encontrado.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {veterinario.foto_perfil_url ? (
        <Image source={{ uri: veterinario.foto_perfil_url }} style={styles.profileImage} onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>Sem foto</Text>
        </View>
      )}
      <Text style={styles.title}>{veterinario.nome_completo}</Text>
      
      <View style={styles.detailItem}>
        <Text style={styles.label}>CRMV:</Text>
        <Text style={styles.value}>{veterinario.crmv}</Text>
      </View>
      {veterinario.cpf && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>CPF:</Text>
          <Text style={styles.value}>{veterinario.cpf}</Text>
        </View>
      )}
      {veterinario.especialidades && JSON.parse(veterinario.especialidades).length > 0 && (
        <View style={styles.detailItemFullWidth}>
          <Text style={styles.label}>Especialidades:</Text>
          <Text style={styles.valueFullWidth}>{JSON.parse(veterinario.especialidades).join(', ')}</Text>
        </View>
      )}
      {veterinario.telefone_contato && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.value}>{veterinario.telefone_contato}</Text>
        </View>
      )}
      {veterinario.email_contato && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{veterinario.email_contato}</Text>
        </View>
      )}
       {veterinario.usuario_email && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Email do Usuário:</Text>
          <Text style={styles.value}>{veterinario.usuario_email}</Text>
        </View>
      )}
      {veterinario.bio_curta && (
        <View style={styles.detailItemFullWidth}>
          <Text style={styles.label}>Bio:</Text>
          <Text style={styles.valueFullWidth}>{veterinario.bio_curta}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button 
            title="Editar Veterinário" 
            onPress={() => navigation.navigate('VeterinarioEdit', { veterinarioData: veterinario })} 
            disabled={loading}
        />
        <Button 
            title="Deletar Veterinário" 
            onPress={handleDeleteVeterinario} 
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
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

export default VeterinarioDetailScreen;

