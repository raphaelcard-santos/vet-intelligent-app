import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DisclaimerBanner = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.bannerText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#fff3cd', // Cor de alerta suave (amarelo)
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  bannerText: {
    flex: 1, // Para que o texto ocupe o espaço restante
    color: '#856404', // Cor do texto para contraste com o fundo amarelo
    fontSize: 14,
    lineHeight: 20, // Melhora a legibilidade
  },
});

export default DisclaimerBanner;

