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


export default function HomeScreen({navigation}) {
  const date = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const [data, setData] = useState(date.split('/').reverse().join('-'));
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    setWelcome(checkEmpresa());
    console.log('Welcome:', welcome);
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
        {welcome == null ?
          <WelcomeModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            onClose={() => setModalVisible(false)}
            navigation={navigation}
          /> : null}
        <WeekBtn navigation={navigation} />
        <CardAgendamentosCount /> 
        <CardAgendamentos navigation={navigation} />
        <View><BtnAgendamento navigation={navigation} /></View>
      </DataContext.Provider>
    </Container>
  );
}

const Container = styled.SafeAreaView`
flex:1;
background-color:${props=>props.theme.background};
`
