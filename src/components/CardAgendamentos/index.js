import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Agendamentos from '../Agendamentos';

const CardAgendamentos = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const [agendamentos, setAgendamentos] = useState([
    { horario: '10h:00s - 10h:30s', servico: 'Tosa e Banho', cliente: 'Juninho do Gás' },
    { horario: '10h:30s - 12h:30s', servico: 'Corte e Progressiva', cliente: 'Claudinha' },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAgendamentos([...agendamentos, { horario: '13h:00s - 15h:30s', servico: 'Clareamento', cliente: 'Cleyton' }]);
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollview}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {agendamentos.map((agendamento, index) => (
          <Agendamentos key={index} {...agendamento} />
        ))}
      </ScrollView>
    </View>
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
});

export default CardAgendamentos;
