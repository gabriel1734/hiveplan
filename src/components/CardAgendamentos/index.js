import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Agendamentos from '../Agendamentos';
import { verAgendamentosPorDia } from '../../database';
import { DataContext } from '../../pages/HomeScreen';

const CardAgendamentos = () => {
  const [refreshing, setRefreshing] = useState(false);

  const {data} = useContext(DataContext);
  
  const [agendamentos, setAgendamentos] = useState(verAgendamentosPorDia(data));

  useEffect(() => {
    onRefresh();
  }, [data]);


  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAgendamentos([...agendamentos]);
      setRefreshing(false);
    }, 1000);
  };

  return(
    agendamentos.length > 0 ? (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollview}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {agendamentos.map((agendamento, index) => (
          <Agendamentos key={agendamento.id} {...agendamento} />
        ))}
          </ScrollView>
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.text}>Nenhum agendamento encontrado para o dia!</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '50%',
  },
  scrollview: {
    height: '100%',
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
