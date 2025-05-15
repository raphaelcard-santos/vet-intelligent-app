import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TutorNavigator from './TutorNavigator'; // Importa o TutorNavigator

// Simulação de um estado de autenticação
// Em um app real, isso viria de um contexto de autenticação, AsyncStorage, Redux, etc.
const userIsAuthenticated = true; // Mude para false para testar o fluxo de AuthNavigator

const Stack = createNativeStackNavigator();

// Navegador principal do App que decide entre fluxo de Autenticação ou App principal
const MainAppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userIsAuthenticated ? (
        // Se autenticado, mostra o conteúdo principal do app
        // Por enquanto, vamos direto para TutorNavigator como exemplo
        <Stack.Screen name="AppCore" component={TutorNavigator} /> 
        // Em um app completo, aqui poderia ter um TabNavigator com várias seções
        // <Stack.Screen name="AppCore" component={MainTabNavigator} /> 
      ) : (
        // Se não autenticado, mostra o fluxo de autenticação
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

