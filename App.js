import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/pages/HomeScreen';
import Agendamento from './src/pages/Agendamento';
import { create, dropTables } from './src/database';
import { createContext } from 'react';
import Colaboradores from './src/pages/Colaboradores';
import { RootSiblingParent } from 'react-native-root-siblings';
import Servicos from './src/pages/Servicos';
import Configuracao from './src/pages/Configuracao';
import MenuScreen from './src/pages/Menu';
import { ThemeProvider } from 'styled-components';
import dark from './src/theme/dark';
import light from './src/theme/light';
import { useColorScheme } from 'react-native';
import themes
 from './src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTheme } from './src/context';
import Clientes from './src/pages/Clientes';

export const AgendamentoScreenContext = createContext();

const Stack = createNativeStackNavigator();  // Create a stack navigator

export default function App() {
 //dropTables();
  create();
  const device = useColorScheme();
  const [theme, setTheme] = useState(device === 'dark' ? dark : light);

  return (
    <RootSiblingParent>
      <DataTheme.Provider value={{ theme, setTheme }}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Menu" component={MenuScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Agendamento" component={Agendamento} />
              <Stack.Screen name="Colaboradores" component={Colaboradores} />
              <Stack.Screen name="Configuracao" component={Configuracao} />
              <Stack.Screen name="Servicos" component={Servicos} />
              <Stack.Screen name="Clientes" component={Clientes} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
        </DataTheme.Provider>
    </RootSiblingParent>
  );
}
