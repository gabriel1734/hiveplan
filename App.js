import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/pages/HomeScreen';
import Agendamento from './src/pages/Agendamento';
import { create, dropTables } from './src/database';
import { createContext } from 'react';
import Colaboradores from './src/pages/Colaboradores';
import { RootSiblingParent } from 'react-native-root-siblings';

export const AgendamentoScreenContext = createContext();

const Stack = createNativeStackNavigator();  // Create a stack navigator

export default function App() {
 // dropTables();
  create();

  return (
    <RootSiblingParent>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Agendamento" component={Agendamento} />
        <Stack.Screen name="Colaboradores" component={Colaboradores} />
      </Stack.Navigator>
    </NavigationContainer>
    </RootSiblingParent>
  );
}
