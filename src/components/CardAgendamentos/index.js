import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Agendamentos from '../Agendamentos';
import { viewAgendamentosPorDia } from '../../database';
import { DataContext } from '../../pages/HomeScreen';

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
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollview}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {agendamentos.map((agendamento, index) => (
            
          <Agendamentos key={agendamento.id} {...agendamento} onRefresh={onRefresh} navigation={navigation} />
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
