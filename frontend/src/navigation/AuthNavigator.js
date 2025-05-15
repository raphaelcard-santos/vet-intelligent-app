import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../screens/AuthScreens/RegisterScreen';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';
// Importar a tela principal do App (ex: AppNavigator ou HomeScreen) quando ela existir
// import AppNavigator from './AppNavigator'; 

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      {/* 
      <Stack.Screen name="App" component={AppNavigator} /> // Exemplo de navegação para o app principal após login
      */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;

