import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Agendamento = ({ horario, servico, cliente }) => {
  return (
    <View style={styles.agendamento}>
      <Text style={styles.horario}>{horario}</Text>
      <View style={styles.servicoCliente}>
        <MaterialIcons name="pets" size={24} color="black" />
        <View style={styles.info}>
          <Text style={styles.infoText}>{servico}</Text>
          <Text style={styles.infoText}>{cliente}</Text>
        </View>
      </View>
      <View style={styles.acoes}>
        <MaterialIcons name="notifications" size={24} color="yellow" />
        <MaterialIcons name="more-vert" size={24} color="black" />
      </View>
    </View>
  );
};

const CardAgendamentos = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [agendamentos, setAgendamentos] = useState([
    { horario: '10h:00s - 10h:30s', servico: 'Tosa e Banho', cliente: 'Juninho do Gás' },
    { horario: '10h:30s - 12h:30s', servico: 'Corte e Progressiva', cliente: 'Claudinha' },
    { horario: '13h:00s - 15h:30s', servico: 'Clareamento', cliente: 'Cleyton' }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {agendamentos.map((agendamento, index) => (
        <Agendamento key={index} {...agendamento} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  agendamento: {
    backgroundColor: '#6D6B69',
    padding: 15,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  horario: {
    fontWeight: 'bold',
    color: 'white',
  },
  servicoCliente: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
      marginLeft: 10,
      color: 'white',
  },
  infoText: {
    color: 'white',
  },  
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CardAgendamentos;
