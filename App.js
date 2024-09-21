import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Agendamento from './src/pages/Agendamento';
import HomeScreen from './src/pages/HomeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Agendamento" component={Agendamento} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}