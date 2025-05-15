import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TutorListScreen from '../screens/TutorScreens/TutorListScreen';
import TutorDetailScreen from '../screens/TutorScreens/TutorDetailScreen';
import TutorCreateScreen from '../screens/TutorScreens/TutorCreateScreen';
import TutorEditScreen from '../screens/TutorScreens/TutorEditScreen';

const Stack = createNativeStackNavigator();

const TutorNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="TutorList">
      <Stack.Screen 
        name="TutorList" 
        component={TutorListScreen} 
        options={{ title: 'Lista de Tutores' }} 
      />
      <Stack.Screen 
        name="TutorDetail" 
        component={TutorDetailScreen} 
        options={{ title: 'Detalhes do Tutor' }} 
      />
      <Stack.Screen 
        name="TutorCreate" 
        component={TutorCreateScreen} 
        options={{ title: 'Cadastrar Novo Tutor' }} 
      />
      <Stack.Screen 
        name="TutorEdit" 
        component={TutorEditScreen} 
        options={{ title: 'Editar Tutor' }} 
      />
    </Stack.Navigator>
  );
};

export default TutorNavigator;

