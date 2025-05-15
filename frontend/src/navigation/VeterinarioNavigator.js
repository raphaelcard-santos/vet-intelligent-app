import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VeterinarioListScreen from '../screens/VeterinarioScreens/VeterinarioListScreen';
import VeterinarioDetailScreen from '../screens/VeterinarioScreens/VeterinarioDetailScreen';
import VeterinarioCreateScreen from '../screens/VeterinarioScreens/VeterinarioCreateScreen';
import VeterinarioEditScreen from '../screens/VeterinarioScreens/VeterinarioEditScreen';

const Stack = createNativeStackNavigator();

const VeterinarioNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="VeterinarioList">
      <Stack.Screen 
        name="VeterinarioList" 
        component={VeterinarioListScreen} 
        options={{ title: 'Lista de Veterinários' }} 
      />
      <Stack.Screen 
        name="VeterinarioDetail" 
        component={VeterinarioDetailScreen} 
        options={{ title: 'Detalhes do Veterinário' }} 
      />
      <Stack.Screen 
        name="VeterinarioCreate" 
        component={VeterinarioCreateScreen} 
        options={{ title: 'Cadastrar Novo Veterinário' }} 
      />
      <Stack.Screen 
        name="VeterinarioEdit" 
        component={VeterinarioEditScreen} 
        options={{ title: 'Editar Veterinário' }} 
      />
    </Stack.Navigator>
  );
};

export default VeterinarioNavigator;

