import { View } from "react-native";
import Header from "../../components/Header";
import CalendarPicker from "../../components/CalendarPicker";
import WeekBtn from "../../components/WeekBtn";



export default function Home() {
  return (
    <View>
      <Header name="Gabriel" />
      <WeekBtn />
    </View>
  );
}