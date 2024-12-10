import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useContext, useState, useEffect, startTransition } from "react";
import { DataContext, DataTheme } from "../../context";
import { countAgendamentosPorDia, countAgendamentosPorSemana } from "../../database";
import styled from "styled-components";
import light from "../../theme/light";


export default function CardAgendamentosCount() {
  const { data, refreshing } = useContext(DataContext);
  const [countDia, setCountDia] = useState(0); 

  const [countSemana, setCountSemana] = useState(0);
  const { theme } = useContext(DataTheme);

  const backgroundColor = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];


  useEffect(() => {
    startTransition(() => {
      async function fetchCount() {
        try {
          let count = await countAgendamentosPorDia(data);
          setCountDia(count);
          count = await countAgendamentosPorSemana(data);
          setCountSemana(count);
        } catch (error) {
          console.error('Erro agendamentos encontrados', error);
        }
      }

      fetchCount();
    });
  }, [data, refreshing]);

  return (
    <Container style={styles.container}>
      <LinearGradient colors={backgroundColor} style={styles.card}>
        <Text style={styles.cardTodayText}>Agendamentos para Hoje</Text>   
        <Text style={styles.cardTodayTextNumber}>{countDia}</Text>
      </LinearGradient>
      <Card>
        <StyledText>Agendamentos para a Semana</StyledText>
        <TextNumber>{countSemana}</TextNumber>
      </Card>
    </Container>
  );
}

const Container = styled.View`
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  width: 46%;
  height: 120px;
  background-color: ${props => props.theme.buttonBackground};
  border-radius:10px;
  padding:10px;
  margin: 5px;
`;

const StyledText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.buttonText};
  text-transform: uppercase;
`;

const TextNumber = styled.Text`
  font-size:32px;
  font-weight: bold;
  color: ${props => props.theme.buttonText};
  text-align: right;
`;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '46%',
    height: 120,
    backgroundColor: '#6D6B69',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  cardWeekText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  cardWeekTextNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
  },
  cardTodayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
  cardTodayTextNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  }
});
