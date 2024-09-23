import { View } from "react-native";
import Header from "../../components/Header";
import WeekBtn from "../../components/WeekBtn";
import CardAgendamentosCount from "../../components/CardAgendamentosCount";
import CardAgendamentos from "../../components/CardAgendamentos";



export default function HomeScreen() {
  return (
    <View>
      <Header name="Gabriel" />
      <WeekBtn />
      <CardAgendamentosCount />
      <CardAgendamentos />
    </View>
  );
}