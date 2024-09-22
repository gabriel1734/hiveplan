import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native-web";

export default function CardAgendamentosCount() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.card}>
        <Text style={styles.cardTodayText}>Agendamentos para Hoje</Text>
        <Text style={styles.cardTodayTextNumber}>07</Text>
      </LinearGradient>
      <View style={styles.card}>
        <Text style={styles.cardWeekText}>Agendamentos para a Semana</Text>
        <Text style={styles.cardWeekTextNumber}>15</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    marginTop: 10,
  },
  card: {
    width: '45%', // Adjust the width as needed
    height: 120,
    backgroundColor: '#6D6B69',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  cardWeekText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  cardWeekTextNumber: {
    fontSize: 48,
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
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  }
});