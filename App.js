import React, { useEffect, useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/pages/HomeScreen';
import Agendamento from './src/pages/Agendamento';
import { create, dropTables } from './src/database';
import Colaboradores from './src/pages/Colaboradores';
import { RootSiblingParent } from 'react-native-root-siblings';
import Servicos from './src/pages/Servicos';
import Configuracao from './src/pages/Configuracao';
import MenuScreen from './src/pages/Menu';
import { ThemeProvider } from 'styled-components';
import dark from './src/theme/dark';
import light from './src/theme/light';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clientes from './src/pages/Clientes';
import { DataTheme } from './src/context';

const Stack = createNativeStackNavigator(); // Create a stack navigator

export default function App() {
  // dropTables();
  create();

  const device = useColorScheme(); // Detect device theme
  const [theme, setTheme] = useState(device === 'dark' ? dark : light);

  // Load theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme === 'dark' ? dark : light);
      } else {
        setTheme(device === 'dark' ? dark : light); // Fallback to device theme
      }
    };
    loadTheme();
  }, [device]);

  // Save theme preference to AsyncStorage
  const toggleTheme = async () => {
    const newTheme = theme === light ? dark : light;
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme === dark ? 'dark' : 'light');
  };

  return (
    <RootSiblingParent>
      <DataTheme.Provider value={{ theme, setTheme, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
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
