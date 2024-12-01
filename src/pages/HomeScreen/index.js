import { View, SafeAreaView } from "react-native";
import Header from "../../components/Header";
import WeekBtn from "../../components/WeekBtn";
import CardAgendamentosCount from "../../components/CardAgendamentosCount";
import CardAgendamentos from "../../components/CardAgendamentos";
import { useState } from "react";
import BtnAgendamento from '../../components/BtnAgendamento';
import WelcomeModal from "../../components/Welcome";
import { DataContext } from "../../context";
import { checkEmpresa } from "../../database";
import { useEffect } from "react";
import styled from "styled-components";
import { useFocusEffect } from "@react-navigation/native";


export default function HomeScreen({navigation}) {
  const date = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const [data, setData] = useState(date.split('/').reverse().join('-'));
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [welcome, setWelcome] = useState('');

  useEffect(() => {
    setWelcome(checkEmpresa());
    if (welcome){
      setModalVisible(true);
    }
  }, []);



  return (
    <Container> 
      <DataContext.Provider value={
        {
          data,
          setData,
          refreshing,
          setRefreshing
        }
      }>
        <Header />
          <WelcomeModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            navigation={navigation}
          />
        <WeekBtn navigation={navigation} />
        <CardAgendamentosCount /> 
        <CardAgendamentos navigation={navigation} />
        <BtnAgendamento navigation={navigation} />
      </DataContext.Provider>
    </Container>
  );
}

const Container = styled.SafeAreaView`
flex:1;
background-color:${props=>props.theme.background};
`
