import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClinicaListScreen from '../screens/ClinicaScreens/ClinicaListScreen';
import ClinicaDetailScreen from '../screens/ClinicaScreens/ClinicaDetailScreen';
import ClinicaCreateScreen from '../screens/ClinicaScreens/ClinicaCreateScreen';
import ClinicaEditScreen from '../screens/ClinicaScreens/ClinicaEditScreen';

const Stack = createNativeStackNavigator();

const ClinicaNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ClinicaList">
      <Stack.Screen 
        name="ClinicaList" 
        component={ClinicaListScreen} 
        options={{ title: 'Lista de Clínicas' }} 
      />
      <Stack.Screen 
        name="ClinicaDetail" 
        component={ClinicaDetailScreen} 
        options={{ title: 'Detalhes da Clínica' }} 
      />
      <Stack.Screen 
        name="ClinicaCreate" 
        component={ClinicaCreateScreen} 
        options={{ title: 'Cadastrar Nova Clínica' }} 
      />
      <Stack.Screen 
        name="ClinicaEdit" 
        component={ClinicaEditScreen} 
        options={{ title: 'Editar Clínica' }} 
      />
      {/* Adicionar aqui telas para gerenciar associação de veterinários à clínica se necessário */}
    </Stack.Navigator>
  );
};

export default ClinicaNavigator;

