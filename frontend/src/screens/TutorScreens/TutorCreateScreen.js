import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import apiClient from '../../services/apiClient';

const TutorCreateScreen = ({ navigation }) => {
  // Campos do formulário para criar um novo tutor
  // Precisa corresponder ao que o backend espera no tutorController.createTutor
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefonePrincipal, setTelefonePrincipal] = useState('');
  const [telefoneSecundario, setTelefoneSecundario] = useState('');
  const [enderecoRua, setEnderecoRua] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoComplemento, setEnderecoComplemento] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [enderecoEstado, setEnderecoEstado] = useState('');
  const [enderecoCep, setEnderecoCep] = useState('');
  
  // IMPORTANTE: O backend espera um `usuario_id` para associar o Tutor a um Usuário existente.
  // Este formulário simplificado não lida com a criação/seleção de Usuário.
  // Em um fluxo real, você precisaria:
  // 1. Permitir que o usuário se cadastre (criando uma entrada em `Usuarios`).
  // 2. Obter o `usuario_id` desse usuário recém-criado ou de um usuário logado.
  // 3. Enviar esse `usuario_id` junto com os dados do tutor.
  // Por enquanto, vamos simular ou exigir um `usuario_id` manualmente para teste.
  const [usuarioId, setUsuarioId] = useState(''); // Temporário para teste

  const [loading, setLoading] = useState(false);

  const handleCreateTutor = async () => {
    if (!nomeCompleto || !telefonePrincipal || !usuarioId) { // Adicionado usuarioId na validação básica
      Alert.alert('Erro', 'Nome completo, telefone principal e ID do Usuário são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const tutorData = {
        usuario_id: usuarioId, // Certifique-se que este usuário existe no backend
        nome_completo: nomeCompleto,
        cpf,
        telefone_principal: telefonePrincipal,
        telefone_secundario: telefoneSecundario,
        endereco_rua: enderecoRua,
        endereco_numero: enderecoNumero,
        endereco_complemento: enderecoComplemento,
        endereco_bairro: enderecoBairro,
        endereco_cidade: enderecoCidade,
        endereco_estado: enderecoEstado,
        endereco_cep: enderecoCep,
      };
      const response = await apiClient.post('/tutores/', tutorData);
      setLoading(false);
      Alert.alert('Sucesso', 'Tutor criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao criar tutor:", error.response ? error.response.data : error.message);
      Alert.alert('Erro ao Criar Tutor', error.response?.data?.message || 'Não foi possível criar o tutor. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Tutor</Text>
      
      <Text style={styles.label}>ID do Usuário (para associação - temporário):</Text>
      <TextInput
        style={styles.input}
        placeholder="ID do Usuário existente"
        value={usuarioId}
        onChangeText={setUsuarioId}
        editable={!loading}
      />

      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput style={styles.input} placeholder="Nome Completo do Tutor" value={nomeCompleto} onChangeText={setNomeCompleto} editable={!loading} />
      
      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} placeholder="CPF (opcional)" value={cpf} onChangeText={setCpf} keyboardType="numeric" editable={!loading} />
      
      <Text style={styles.label}>Telefone Principal *</Text>
      <TextInput style={styles.input} placeholder="Telefone Principal" value={telefonePrincipal} onChangeText={setTelefonePrincipal} keyboardType="phone-pad" editable={!loading} />
      
      <Text style={styles.label}>Telefone Secundário</Text>
      <TextInput style={styles.input} placeholder="Telefone Secundário (opcional)" value={telefoneSecundario} onChangeText={setTelefoneSecundario} keyboardType="phone-pad" editable={!loading} />
      
      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} placeholder="Rua/Avenida" value={enderecoRua} onChangeText={setEnderecoRua} editable={!loading} />
      <TextInput style={styles.input} placeholder="Número" value={enderecoNumero} onChangeText={setEnderecoNumero} keyboardType="numeric" editable={!loading} />
      <TextInput style={styles.input} placeholder="Complemento (opcional)" value={enderecoComplemento} onChangeText={setEnderecoComplemento} editable={!loading} />
      <TextInput style={styles.input} placeholder="Bairro" value={enderecoBairro} onChangeText={setEnderecoBairro} editable={!loading} />
      <TextInput style={styles.input} placeholder="Cidade" value={enderecoCidade} onChangeText={setEnderecoCidade} editable={!loading} />
      <TextInput style={styles.input} placeholder="Estado (UF)" value={enderecoEstado} onChangeText={setEnderecoEstado} maxLength={2} autoCapitalize="characters" editable={!loading} />
      <TextInput style={styles.input} placeholder="CEP" value={enderecoCep} onChangeText={setEnderecoCep} keyboardType="numeric" editable={!loading} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Salvar Tutor" onPress={handleCreateTutor} />
      )}
      <Button title="Cancelar" onPress={() => navigation.goBack()} disabled={loading} color="gray" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'lightgray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default TutorCreateScreen;

