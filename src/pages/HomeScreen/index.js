import { View } from "react-native";
import Header from "../../components/Header";
import WeekBtn from "../../components/WeekBtn";
import CardAgendamentosCount from "../../components/CardAgendamentosCount";
import CardAgendamentos from "../../components/CardAgendamentos";
import { createContext, useState } from "react";
import { adicionarAgendamento, adicionarTipoAgendamento, verAgendamentos } from "../../database";

export const DataContext = createContext();

export default function HomeScreen({navigation}) {
  const date = new Date();
  const [data, setData] = useState(date.toISOString().split('T')[0]);

  return (
    <View>
      <DataContext.Provider value={
        {
          data,
          setData,
        }
      }>
        <Header />
        <WeekBtn navigation={navigation} />
        <CardAgendamentosCount />
        <CardAgendamentos />
      </DataContext.Provider>
    </View>
  );
}