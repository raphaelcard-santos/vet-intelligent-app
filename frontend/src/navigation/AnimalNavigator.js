import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimalListScreen from '../screens/AnimalScreens/AnimalListScreen';
import AnimalDetailScreen from '../screens/AnimalScreens/AnimalDetailScreen';
import AnimalCreateScreen from '../screens/AnimalScreens/AnimalCreateScreen';
import AnimalEditScreen from '../screens/AnimalScreens/AnimalEditScreen';

const Stack = createNativeStackNavigator();

const AnimalNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AnimalList">
      <Stack.Screen 
        name="AnimalList" 
        component={AnimalListScreen} 
        options={{ title: 'Lista de Animais' }} 
      />
      <Stack.Screen 
        name="AnimalDetail" 
        component={AnimalDetailScreen} 
        options={{ title: 'Detalhes do Animal' }} 
      />
      <Stack.Screen 
        name="AnimalCreate" 
        component={AnimalCreateScreen} 
        options={{ title: 'Cadastrar Novo Animal' }} 
      />
      <Stack.Screen 
        name="AnimalEdit" 
        component={AnimalEditScreen} 
        options={{ title: 'Editar Animal' }} 
      />
    </Stack.Navigator>
  );
};

export default AnimalNavigator;

