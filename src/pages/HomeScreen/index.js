import { View } from "react-native";
import Header from "../../components/Header";
import BtnAgendamento from "../../components/BtnAgendamento";



export default function HomeScreen() {
  return (
    <View>
      <Header name="Gabriel" />
      <BtnAgendamento />
    </View>
  );
}