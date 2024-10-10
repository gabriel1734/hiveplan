import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text'; // Importação da máscara de texto
import { addAgendamento, adicionarAgendamento, editarAgendamento, getAgendamento, verTipoAgendamentos, viewAgendamentoID, viewServicoAll } from '../../database';
import BtnAddServ from '../../components/BtnAddServ';
import AntDesign from '@expo/vector-icons/AntDesign';

const Agendamento = ({navigation, route}) => {
  const date = new Date().toLocaleTimeString().split(':');
  const localeDate = `${date[0]}:${date[1]}`;

  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [clientName, setClientName] = useState('');
  const [time, setTime] = useState(localeDate)
  const [observation, setObservation] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [tiposServico, setTiposServico] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [idAgendamento, setIdAgendamento] = useState(null);
  const [erroTelefone, setErroTelefone] = useState(false);

  useEffect(() => {
    const { id } = route.params || {};
    
    if (id) {
      const result = viewAgendamentoID(id);
      console.log(result);
      setSelectedDate(result.dataAgendamento);
      setServiceType(result.servico);
      setTime(result.horaAgendamento);
      setClientName(result.nomeCliente);
      setTelefone(result.telCliente);
      setObservation(result.descricao);
      setIdAgendamento(id);
    }
  }, [route.params]);
  
  

  useEffect(() => {
    const resultTiposServico = viewServicoAll();

    if (resultTiposServico.length > 0) {
      setTiposServico(resultTiposServico.map((tipo) => ({label: tipo.nome, value: tipo.id})));
    } else {
      setTiposServico([{label: 'Nenhum tipo de serviço encontrado', value: 0}]);
    }
  }, [refresh]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const compareTimes = (start, end) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startDate = new Date();
    const endDate = new Date();

    startDate.setHours(startHour, startMinute);
    endDate.setHours(endHour, endMinute);

    return startDate < endDate;
  };

  const handleStartTimePickerChange = (event, selectedDate) => {
    setTimePickerVisible(false);
    if (event.type === 'set' && selectedDate) { 
      const formattedTime = selectedDate.toISOString().split('T')[1].substring(0, 5);
      if (!compareTimes(formattedTime, endTime)) {
        Alert.alert('Erro', 'A hora de início não pode ser maior ou igual à hora de fim.');
      } else {
        setStartTime(formattedTime);
      }
    }
  };

  const handleSave = () => {
  let hasErrors = false;

  // Validation: Check if each field is filled, if not set an error flag and display alert
  if (!selectedDate) {
    Alert.alert('Erro', 'Por favor, selecione uma data.');
    hasErrors = true;
  }
  if (!serviceType) {
    Alert.alert('Erro', 'Por favor, selecione um tipo de serviço.');
    hasErrors = true;
  }
  if (!clientName) {
     Alert.alert('Erro', 'Por favor, escreva o nome de um cliente.');
    hasErrors = true;
  }
  if (!telefone) {
    Alert.alert('Erro', 'Por favor, escreva um telefone.');
    hasErrors = true;
  }
  if (!time) {
    Alert.alert('Erro', 'Por favor, selecione uma hora de início.');
    hasErrors = true;
  }    
  if (telefone.length < 15) {
      Alert.alert('Erro', 'O telefone deve ter no mínimo 10 dígitos.');
      setErroTelefone(true);
      hasErrors = true;
  }

  if (hasErrors) {
    return;
    }
    
    setErroTelefone(false);
  
    if (idAgendamento) {
    console.log('Editar');
   //editarAgendamento(idAgendamento, selectedDate, startTime, endTime, serviceType, clientName, telefone, observation);
  }else{
   if( addAgendamento(selectedDate,time,clientName,telefone,observation,serviceType,1)){
    Alert.alert("Ok","Certo!");
   }
   else{
    Alert.alert("Erro","Erro!");
   }
    }
    
    navigation.navigate('Home');
}

  return (      
    <ScrollView style={styles.container}>
      <StatusBar style='auto' backgroundColor='#F7FF89' />
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() =>{navigation.navigate('Home')}} />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
      
      <View style={{ padding: 20 }}>
        {/* Tipo de Serviço */}
        <Text style={styles.label}>Tipo de Serviço</Text>
        <View style={styles.tiposServicoContainer}>
          <View style={styles.pickerSelectTelInput}>
            <RNPickerSelect
              onValueChange={(value) => setServiceType(value)}
              items={tiposServico}
              placeholder={{ label: 'Selecione o Tipo de Serviço', value: null }}
              style={styles.pickerSelectTelInput}
              value={serviceType ? serviceType : null}
            />
          </View>
          <BtnAddServ refresh={refresh} setRefresh={setRefresh} />
        </View>
        {/* Nome do Cliente */}
        <Text style={styles.label}>colaborador</Text>
        <View style={styles.tiposServicoContainer}>
          <View style={styles.pickerSelectTelInput}>
            <RNPickerSelect
              onValueChange={(value) => setServiceType(value)}
              items={tiposServico}
              placeholder={{ label: 'Selecione o Tipo de Serviço', value: null }}
              style={styles.pickerSelectTelInput}
              value={serviceType ? serviceType : null}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('Colaboradores')}>
            <Text style={styles.buttonText}>
              <AntDesign style={styles.text} name="plussquare" size={24} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.label}>Nome do Cliente</Text>
          <TextInput 
            
            style={styles.timeInput}
            value={clientName}
            onChangeText={(text) => setClientName(text)}
            placeholder="Nome do Cliente"
          />
        </View>

        {/* Telefone com máscara */}
        <View>
          <Text style={styles.label}>Telefone</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            style={erroTelefone ? [styles.timeInput, styles.inputError] : styles.timeInput}
            value={telefone}
            onChangeText={(text) => {
              setTelefone(text);

              if (text.length < 10) {
                setErroTelefone(true);
              } else {
                setErroTelefone(false);
              }
            }}
            placeholder="Telefone"
            keyboardType="numeric"
          />
        </View>

        {/* Horário de Início */}
        <View>
          <Text style={styles.label}>Hora</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setTimePickerVisible(true)}
          >
            <Text style={styles.timeButtonText}>{time}</Text>
          </TouchableOpacity>

          {isTimePickerVisible && (
            <RNDateTimePicker
              onChange={handleStartTimePickerChange}
              mode="time"
              is24Hour={true}
              display="default"
              value={new Date()}
              timeZoneOffsetInMinutes={0}
            />
          )}
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
        <View style={styles.btnSalvarContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={{ width: '50%', alignItems: 'center', height: '100%', borderRadius: 15 }}>
              <Text style={styles.saveButtonText}>SALVAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tiposServicoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
  },
  pickerSelectTelInput: {
    width: '80%',
    height: 50,
  },
   inputError: {
    borderColor: 'red',
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
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000',
  },
   timeButton: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnSalvarContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignContent:'center',
  },
  saveButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems:'center',
    alignContent:'center',
    padding: 10,
    borderRadius: 10,
    width: 700,
    height: 70,
    flexDirection:'row',
  },
  saveButtonText: {
    paddingTop: 15,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom:0,
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
  timeInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  colaboradoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});



export default Agendamento;
