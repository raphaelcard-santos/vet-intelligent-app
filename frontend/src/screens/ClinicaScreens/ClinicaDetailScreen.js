import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import apiClient from '../../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';

const ClinicaDetailScreen = ({ route, navigation }) => {
  const { clinicaId } = route.params;
  const [clinica, setClinica] = useState(null);
  const [veterinariosAssociados, setVeterinariosAssociados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVets, setLoadingVets] = useState(false);
  const [error, setError] = useState(null);

  const fetchClinicaDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/clinicas/${clinicaId}`);
      setClinica(response.data);
      fetchVeterinariosAssociados(clinicaId); // Carregar veterinários após carregar clínica
    } catch (e) {
      console.error("Erro ao buscar detalhes da clínica:", e.response ? e.response.data : e.message);
      setError('Não foi possível carregar os detalhes da clínica.');
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da clínica.');
    }
    setLoading(false);
  };

  const fetchVeterinariosAssociados = async (id) => {
    setLoadingVets(true);
    try {
        const response = await apiClient.get(`/clinicas/${id}/veterinarios`);
        setVeterinariosAssociados(response.data);
    } catch (e) {
        console.error("Erro ao buscar veterinários associados:", e.response ? e.response.data : e.message);
        // Não mostrar alerta aqui para não sobrepor o erro principal da clínica
    }
    setLoadingVets(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (clinicaId) {
        fetchClinicaDetails();
      }
      return () => {}; 
    }, [clinicaId])
  );

  const handleDeleteClinica = async () => {
    Alert.alert(
      "Confirmar Deleção",
      `Você tem certeza que deseja deletar a clínica ${clinica?.nome_fantasia}? Esta ação não pode ser desfeita.`, 
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
              await apiClient.delete(`/clinicas/${clinicaId}`);
              setLoading(false);
              Alert.alert("Sucesso", "Clínica deletada com sucesso!");
              navigation.goBack(); 
            } catch (e) {
              setLoading(false);
              console.error("Erro ao deletar clínica:", e.response ? e.response.data : e.message);
              Alert.alert("Erro ao Deletar", e.response?.data?.message || "Não foi possível deletar a clínica.");
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
        <Button title="Tentar Novamente" onPress={fetchClinicaDetails} />
      </View>
    );
  }

  if (!clinica) {
    return (
        <View style={styles.centeredMessage}>
            <Text>Nenhum detalhe de clínica encontrado.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {clinica.foto_fachada_url ? (
        <Image source={{ uri: clinica.foto_fachada_url }} style={styles.fachadaImage} onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>Sem foto da fachada</Text>
        </View>
      )}
      <Text style={styles.title}>{clinica.nome_fantasia}</Text>
      
      {clinica.razao_social && <View style={styles.detailItem}><Text style={styles.label}>Razão Social:</Text><Text style={styles.value}>{clinica.razao_social}</Text></View>}
      <View style={styles.detailItem}><Text style={styles.label}>CNPJ:</Text><Text style={styles.value}>{clinica.cnpj}</Text></View>
      {clinica.endereco_completo && <View style={styles.detailItemFullWidth}><Text style={styles.label}>Endereço:</Text><Text style={styles.valueFullWidth}>{clinica.endereco_completo}</Text></View>}
      {clinica.telefone_principal && <View style={styles.detailItem}><Text style={styles.label}>Telefone:</Text><Text style={styles.value}>{clinica.telefone_principal}</Text></View>}
      {clinica.email_principal && <View style={styles.detailItem}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{clinica.email_principal}</Text></View>}
      {clinica.horario_atendimento && <View style={styles.detailItemFullWidth}><Text style={styles.label}>Horário:</Text><Text style={styles.valueFullWidth}>{clinica.horario_atendimento}</Text></View>}
      {clinica.website && <View style={styles.detailItem}><Text style={styles.label}>Website:</Text><Text style={styles.value}>{clinica.website}</Text></View>}
      {clinica.servicos_oferecidos && JSON.parse(clinica.servicos_oferecidos).length > 0 && (
        <View style={styles.detailItemFullWidth}>
          <Text style={styles.label}>Serviços:</Text>
          <Text style={styles.valueFullWidth}>{JSON.parse(clinica.servicos_oferecidos).join(', ')}</Text>
        </View>
      )}
      {/* TODO: Exibir nome do responsável técnico ao invés do ID */}
      {clinica.responsavel_tecnico_id && <View style={styles.detailItem}><Text style={styles.label}>Responsável Técnico ID:</Text><Text style={styles.value}>{clinica.responsavel_tecnico_id}</Text></View>}
      {clinica.observacoes && <View style={styles.detailItemFullWidth}><Text style={styles.label}>Observações:</Text><Text style={styles.valueFullWidth}>{clinica.observacoes}</Text></View>}

      <Text style={styles.sectionTitle}>Veterinários Associados</Text>
      {loadingVets ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : veterinariosAssociados.length > 0 ? (
        <FlatList
          data={veterinariosAssociados}
          keyExtractor={(item) => item.veterinario_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VeterinarioDetail', { veterinarioId: item.veterinario_id })}>
                <View style={styles.vetItemContainer}>
                    <Text style={styles.vetItemText}>{item.nome_completo}</Text>
                    <Text style={styles.vetItemSubText}>CRMV: {item.crmv}</Text>
                </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false} // Para evitar scroll dentro de scroll
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum veterinário associado a esta clínica.</Text>
      )}
      {/* Botão para gerenciar associações pode ser adicionado aqui */}

      <View style={styles.buttonContainer}>
        <Button 
            title="Editar Clínica" 
            onPress={() => navigation.navigate('ClinicaEdit', { clinicaData: clinica })} 
            disabled={loading}
        />
        <Button 
            title="Deletar Clínica" 
            onPress={handleDeleteClinica} 
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
  fachadaImage: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  vetItemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  vetItemText: {
    fontSize: 16,
  },
  vetItemSubText: {
    fontSize: 12,
    color: 'grey',
  },
  noDataText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 10,
  }
});

export default ClinicaDetailScreen;

