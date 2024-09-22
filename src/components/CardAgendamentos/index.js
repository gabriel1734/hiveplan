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
          <Text>{servico}</Text>
          <Text>{cliente}</Text>
        </View>
      </View>
      <View style={styles.acoes}>
        <MaterialIcons name="notifications" size={24} color="black" />
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
    // ... adicione mais agendamentos aqui
  ]);

  const onRefresh = () => {
    // Lógica para atualizar os agendamentos (chamada à API, por exemplo)
    setRefreshing(true);
    // Simulação de atualização:
    setTimeout(() => {
      setAgendamentos([...agendamentos, { horario: '13h:00s - 15h:30s', servico: 'Clareamento', cliente: 'Cleyton' }]);
      setRefreshing(false);
    }, 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={true}
      vertical
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
    marginBottom: 10,
    borderRadius: 10,
  },
  horario: {
    fontWeight: 'bold',
  },
  servicoCliente: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 10,
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