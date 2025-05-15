import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const TutorDetailScreen = ({ route, navigation }) => {
  const { tutorId } = route.params;
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTutorDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/tutores/${tutorId}`);
      setTutor(response.data);
    } catch (e) {
      console.error("Erro ao buscar detalhes do tutor:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar os detalhes do tutor.');
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do tutor.');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (tutorId) {
        fetchTutorDetails();
      }
      return () => {}; 
    }, [tutorId])
  );

  const handleDeleteTutor = async () => {
    Alert.alert(
      "Confirmar Deleção",
      `Você tem certeza que deseja deletar o tutor ${tutor?.nome_completo}? Esta ação não pode ser desfeita.`, // Adicionado nome do tutor
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
              await apiClient.delete(`/tutores/${tutorId}`);
              setLoading(false);
              Alert.alert("Sucesso", "Tutor deletado com sucesso!");
              navigation.goBack(); // Voltar para a lista após deletar
            } catch (e) {
              setLoading(false);
              console.error("Erro ao deletar tutor:", e.response ? e.response.data : e.message);
              Alert.alert("Erro ao Deletar", e.response?.data?.message || "Não foi possível deletar o tutor. Verifique se há animais associados.");
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
        <Button title="Tentar Novamente" onPress={fetchTutorDetails} />
      </View>
    );
  }

  if (!tutor) {
    return (
        <View style={styles.centeredMessage}>
            <Text>Nenhum detalhe de tutor encontrado.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{tutor.nome_completo}</Text>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Email (Usuário):</Text>
        <Text style={styles.value}>{tutor.usuario_email || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{tutor.cpf || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Telefone Principal:</Text>
        <Text style={styles.value}>{tutor.telefone_principal}</Text>
      </View>
      {tutor.telefone_secundario && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Telefone Secundário:</Text>
          <Text style={styles.value}>{tutor.telefone_secundario}</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>Endereço</Text>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Rua:</Text>
        <Text style={styles.value}>{tutor.endereco_rua || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Número:</Text>
        <Text style={styles.value}>{tutor.endereco_numero || 'N/A'}</Text>
      </View>
      {tutor.endereco_complemento && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Complemento:</Text>
          <Text style={styles.value}>{tutor.endereco_complemento}</Text>
        </View>
      )}
      <View style={styles.detailItem}>
        <Text style={styles.label}>Bairro:</Text>
        <Text style={styles.value}>{tutor.endereco_bairro || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{tutor.endereco_cidade || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{tutor.endereco_estado || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>CEP:</Text>
        <Text style={styles.value}>{tutor.endereco_cep || 'N/A'}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button 
            title="Editar Tutor" 
            onPress={() => navigation.navigate('TutorEdit', { tutorData: tutor })} 
            disabled={loading}
        />
        <Button 
            title="Deletar Tutor" 
            onPress={handleDeleteTutor} 
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexShrink: 1, // Permite que o texto quebre a linha se for muito longo
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default TutorDetailScreen;

