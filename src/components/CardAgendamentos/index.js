import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Agendamentos from '../Agendamentos';
import { viewAgendamentosPorDia } from '../../database';
import { DataContext } from '../../context';
import styled from 'styled-components';

const CardAgendamentos = ({navigation}) => {
  

  const {data, refreshing, setRefreshing} = useContext(DataContext);
  
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    setAgendamentos(viewAgendamentosPorDia(data));
  }, [data]);


  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAgendamentos(viewAgendamentosPorDia(data));
      setRefreshing(false);
    }, 1000);
  };

  return(
    agendamentos.length > 0 ? (
      <Container>
        <StyledScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {agendamentos.map((agendamento, index) => (
            
          <Agendamentos key={agendamento.id} {...agendamento} onRefresh={onRefresh} navigation={navigation} />
        ))}
          </StyledScrollView>
      </Container>
    ) : (
      <Container style={styles.container}>
        <StyledText>Nenhum agendamento encontrado para o dia!</StyledText>
      </Container>
    )
  );
};

const Container = styled.View`
  padding: 5px;
  height: 445px;
`;

const StyledText = styled.Text`
  font-size:14px;
  font-weight:bold;
  text-align: center;
  margin-top: 10px;
  background-color:${props => props.theme.buttonBackground};
  padding: 20px;
  color: ${props => props.theme.buttonText};
  border-radius: 10px;
`;

const StyledScrollView = styled.ScrollView`
  height: 50%;
  margin-bottom: 50;
`;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: 445,
  },
  scrollview: {
    height: '50%',
    marginBottom: 50,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#6D6B69',
    padding: 20,
    color: '#fff',
    borderRadius: 10,
  },
});

export default CardAgendamentos;
