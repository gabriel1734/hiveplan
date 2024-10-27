import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useContext, useState, useEffect, startTransition } from "react";
import { DataContext } from "../../pages/HomeScreen";
import { countAgendamentosPorDia, countAgendamentosPorSemana } from "../../database";

export default function CardAgendamentosCount() {
  const { data, refreshing } = useContext(DataContext);
  const [countDia, setCountDia] = useState(0); 

  const [countSemana, setCountSemana] = useState(0);

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
    <View style={styles.container}>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.card}>
        <Text style={styles.cardTodayText}>Agendamentos para Hoje</Text>   
        <Text style={styles.cardTodayTextNumber}>{countDia}</Text>
      </LinearGradient>
      <View style={styles.card}>
        <Text style={styles.cardWeekText}>Agendamentos para a Semana</Text>
        <Text style={styles.cardWeekTextNumber}>{countSemana}</Text>
      </View>
    </View>
  );
}

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
