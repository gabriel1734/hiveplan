import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons'; // ou outra biblioteca de ícones
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header';


const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [clientName, setClientName] = useState('');
  const [startTime, setStartTime] = useState('10:30');
  const [endTime, setEndTime] = useState('11:30');
  const [observation, setObservation] = useState('');

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleSave = () => {
    // Lógica para salvar as informações inseridas
    console.log({
      selectedDate,
      serviceType,
      clientName,
      startTime,
      endTime,
      observation,
    });
  };

  return (
    <ScrollView>
      <StatusBar style = 'auto' backgroundColor='#F7FF89'/>
    <View style={styles.container}>
    <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
      <View style = {{justifyContent: 'center', alignItems:'center'}}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#000',
            selectedTextColor: '#fff',
          },
        }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#000',
          selectedDayBackgroundColor: '#000',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#000',
          dayTextColor: '#000',
          arrowColor: 'black',
          monthTextColor: '#000',
        }}
      />
      </View>
      </LinearGradient>

      {/* Tipo de Serviço */}
      <Text style={styles.label}>Tipo de Serviço</Text>
      <RNPickerSelect
        onValueChange={(value) => setServiceType(value)}
        items={[
          { label: 'Serviço 1', value: 'servico1' },
          { label: 'Serviço 2', value: 'servico2' },
          { label: 'Serviço 3', value: 'servico3' },
        ]}
        placeholder={{ label: 'Selecione o Tipo de Serviço', value: null }}
        style={pickerSelectStyles}
      />

      {/* Nome do Cliente */}
      <Text style={styles.label}>Nome do Cliente</Text>
      <RNPickerSelect
        onValueChange={(value) => setClientName(value)}
        items={[
          { label: 'Cliente 1', value: 'cliente1' },
          { label: 'Cliente 2', value: 'cliente2' },
          { label: 'Cliente 3', value: 'cliente3' },
        ]}
        placeholder={{ label: 'Selecione o Nome do Cliente', value: null }}
        style={pickerSelectStyles}
      />

      {/* Horários de Início e Fim */}
      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>Início</Text>
          <TextInput
            style={styles.timeInput}
            value={startTime}
            onChangeText={(text) => setStartTime(text)}
            placeholder="Início"
          />
        </View>
        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>Fim</Text>
          <TextInput
            style={styles.timeInput}
            value={endTime}
            onChangeText={(text) => setEndTime(text)}
            placeholder="Fim"
          />
        </View>
      </View>

      {/* Observação */}
      <Text style={styles.label}>Observação</Text>
      <TextInput
        style={styles.observationInput}
        value={observation}
        onChangeText={(text) => setObservation(text)}
        placeholder="Adicione uma observação"
        multiline
      />

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>SALVAR</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  timeInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  observationInput: {
    height: 80,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#f5d142',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputAndroid: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default Agendamento;
