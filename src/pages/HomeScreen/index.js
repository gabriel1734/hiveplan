import { View, SafeAreaView } from "react-native";
import Header from "../../components/Header";
import WeekBtn from "../../components/WeekBtn";
import CardAgendamentosCount from "../../components/CardAgendamentosCount";
import CardAgendamentos from "../../components/CardAgendamentos";
import { createContext, useEffect, useState } from "react";
import BtnAgendamento from '../../components/BtnAgendamento';

export const DataContext = createContext();

export default function HomeScreen({navigation}) {
  const date = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const [data, setData] = useState(date.split('/').reverse().join('-'));
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView> 
      <DataContext.Provider value={
        {
          data,
          setData,
          refreshing,
          setRefreshing
        }
      }>
        <Header />
        <WeekBtn navigation={navigation} />
        <CardAgendamentosCount />
        <CardAgendamentos navigation={navigation} />
        <View><BtnAgendamento navigation={navigation} /></View>
      </DataContext.Provider>
    </SafeAreaView>
  );
}
