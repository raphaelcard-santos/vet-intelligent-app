import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import Tab Navigator

import AuthNavigator from './AuthNavigator';
import TutorNavigator from './TutorNavigator';
import AnimalNavigator from './AnimalNavigator'; // Import AnimalNavigator

// Simulação de um estado de autenticação
const userIsAuthenticated = true; // Mude para false para testar o fluxo de AuthNavigator

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// TabNavigator para quando o usuário está autenticado
const MainAppTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="TutoresTab" 
        component={TutorNavigator} 
        options={{ title: 'Tutores' }} // Ícone pode ser adicionado aqui
      />
      <Tab.Screen 
        name="AnimaisTab" 
        component={AnimalNavigator} 
        options={{ title: 'Animais' }} // Ícone pode ser adicionado aqui
      />
      {/* Adicionar outras abas principais aqui (Ex: Consultas, Diagnósticos) */}
    </Tab.Navigator>
  );
};


// Navegador principal do App que decide entre fluxo de Autenticação ou App principal
const MainAppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userIsAuthenticated ? (
        <Stack.Screen name="AppCore" component={MainAppTabs} /> 
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainAppNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;

