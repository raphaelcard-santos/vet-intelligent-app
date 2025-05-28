import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Função auxiliar para mapear probabilidade/urgência para cores (exemplo)
const getStyleByLevel = (level) => {
  const lowerLevel = level?.toLowerCase();
  if (lowerLevel?.includes('alta') || lowerLevel?.includes('alto')) {
    return { container: styles.levelHigh, text: styles.levelTextHigh };
  }
  if (lowerLevel?.includes('média') || lowerLevel?.includes('medio')) {
    return { container: styles.levelMedium, text: styles.levelTextMedium };
  }
  if (lowerLevel?.includes('baixa') || lowerLevel?.includes('baixo')) {
    return { container: styles.levelLow, text: styles.levelTextLow };
  }
  return { container: {}, text: {} }; // Estilo padrão
};

const ResultCard = ({ diagnostico }) => {
  if (!diagnostico) {
    return null;
  }

  const { condicao, probabilidade_estimada, descricao, tratamentos_sugeridos, nivel_urgencia, observacoes_adicionais } = diagnostico;

  const urgenciaStyle = getStyleByLevel(nivel_urgencia);
  const probabilidadeStyle = getStyleByLevel(probabilidade_estimada);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.conditionTitle}>{condicao || 'Condição não informada'}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Probabilidade:</Text>
        <View style={[styles.levelBadge, probabilidadeStyle.container]}>
          <Text style={[styles.levelText, probabilidadeStyle.text]}>{probabilidade_estimada || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Nível de Urgência:</Text>
        <View style={[styles.levelBadge, urgenciaStyle.container]}>
          <Text style={[styles.levelText, urgenciaStyle.text]}>{nivel_urgencia || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Descrição:</Text>
      <Text style={styles.sectionContent}>{descricao || 'Sem descrição.'}</Text>

      <Text style={styles.sectionTitle}>Tratamentos Sugeridos:</Text>
      {tratamentos_sugeridos && tratamentos_sugeridos.length > 0 ? (
        tratamentos_sugeridos.map((tratamento, index) => (
          <Text key={index} style={styles.listItem}>• {tratamento}</Text>
        ))
      ) : (
        <Text style={styles.sectionContent}>Nenhum tratamento sugerido.</Text>
      )}

      {observacoes_adicionais && (
        <>
          <Text style={styles.sectionTitle}>Observações Adicionais:</Text>
          <Text style={styles.sectionContent}>{observacoes_adicionais}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  conditionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  levelHigh: {
    backgroundColor: '#f8d7da', // Vermelho claro
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  levelTextHigh: {
    color: '#721c24', // Vermelho escuro
  },
  levelMedium: {
    backgroundColor: '#fff3cd', // Amarelo claro
    borderColor: '#ffeeba',
    borderWidth: 1,
  },
  levelTextMedium: {
    color: '#856404', // Amarelo escuro
  },
  levelLow: {
    backgroundColor: '#d4edda', // Verde claro
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  levelTextLow: {
    color: '#155724', // Verde escuro
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#495057',
  },
  sectionContent: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginLeft: 10, // Indentação para itens de lista
    marginBottom: 3,
  },
});

export default ResultCard;

