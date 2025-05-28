import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DiagnosticoInputScreen from '../screens/DiagnosticoScreens/DiagnosticoInputScreen';
import DiagnosticoResultScreen from '../screens/DiagnosticoScreens/DiagnosticoResultScreen';

const Stack = createStackNavigator();

const DiagnosticoNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DiagnosticoInput"
      screenOptions={{
        headerShown: true, // Mostrar cabeçalho por padrão neste fluxo
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#6200ee', // Cor roxa principal (exemplo)
        },
        headerTintColor: '#fff', // Cor do texto do cabeçalho
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DiagnosticoInput"
        component={DiagnosticoInputScreen}
        options={{ title: 'Iniciar Diagnóstico IA' }}
      />
      <Stack.Screen
        name="DiagnosticoResult"
        component={DiagnosticoResultScreen}
        options={{ title: 'Resultado Diagnóstico IA' }}
      />
    </Stack.Navigator>
  );
};

export default DiagnosticoNavigator;

