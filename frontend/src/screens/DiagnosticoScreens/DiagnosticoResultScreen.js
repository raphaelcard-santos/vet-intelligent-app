import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import DisclaimerBanner from '../../components/Diagnostico/DisclaimerBanner';
import ResultCard from '../../components/Diagnostico/ResultCard';

const DiagnosticoResultScreen = ({ route }) => {
  // Recebe o resultado completo da API via parâmetros de navegação
  const { resultado } = route.params;

  // Verifica se os dados de resultado foram recebidos
  if (!resultado) {
    return (
      <View style={styles.centered}>
        <Text>Erro: Dados do diagnóstico não encontrados.</Text>
      </View>
    );
  }

  const { sugestoesDiagnosticas, disclaimer, animalInfo, sintomasFornecidos, observacoesFornecidas, dataHora } = resultado;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sugestões de Diagnóstico por IA</Text>

      {/* Exibe o Disclaimer primeiro e de forma destacada */}
      <DisclaimerBanner text={disclaimer} />

      {/* Informações da Solicitação */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Informações da Solicitação:</Text>
        <Text style={styles.infoText}>Data/Hora: {new Date(dataHora).toLocaleString('pt-BR')}</Text>
        {animalInfo && (
          <Text style={styles.infoText}>
            Animal: {animalInfo.nome || 'N/A'} ({animalInfo.especie || 'N/A'} - {animalInfo.raca || 'N/A'}, {animalInfo.idade || 'N/A'})
          </Text>
        )}
        <Text style={styles.infoText}>Sintomas Fornecidos: {sintomasFornecidos?.join(', ') || 'N/A'}</Text>
        {observacoesFornecidas && <Text style={styles.infoText}>Observações: {observacoesFornecidas}</Text>}
      </View>

      {/* Lista de Sugestões de Diagnóstico */}
      <Text style={styles.suggestionsTitle}>Sugestões:</Text>
      {sugestoesDiagnosticas && sugestoesDiagnosticas.length > 0 ? (
        sugestoesDiagnosticas.map((diag, index) => (
          <ResultCard key={diag.condicao || index} diagnostico={diag} />
        ))
      ) : (
        <View style={styles.centered}>
          <Text>Nenhuma sugestão de diagnóstico foi retornada.</Text>
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#343a40',
  },
  infoSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
});

export default DiagnosticoResultScreen;

