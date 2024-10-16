import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Checkbox } from 'react-native-paper'; // Importação do Checkbox
import { TextInputMask } from 'react-native-masked-text';
import { addAgendamento, viewServicoAll, viewAgendamentoID, viewColaboradorAll, editarAgendamento, updateAgendamento, viewServicoAgendamento, viewColaboradorAgendamento } from '../../database';
import BtnAddServ from '../../components/BtnAddServ';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-root-toast';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const Agendamento = ({ navigation, route }) => {
  const date = new Date().toLocaleTimeString().split(':');
  const localeDate = `${date[0]}:${date[1]}`;

  const [selectedDate, setSelectedDate] = useState(null);
  const [clientName, setClientName] = useState('');
  const [time, setTime] = useState(localeDate);
  const [observation, setObservation] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tiposServico, setTiposServico] = useState([]);
  const [selectedServices, setSelectedServices] = useState({}); // Para rastrear os serviços selecionados
  const [refresh, setRefresh] = useState(false);
  const [idAgendamento, setIdAgendamento] = useState(null);
  const [erroTelefone, setErroTelefone] = useState(false);
  const [colaboradores, setColaboradores] = useState([]);
  const [selectedColaboradores, setSelectedColaboradores] = useState({});
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);	

  useEffect(() => {
    const { id, refreshColab } = route.params || {};
    if (refreshColab) {
      setRefresh(!refresh);
    }
    if (id) {
      const result = viewAgendamentoID(id);
      setSelectedDate(result.dataAgendamento);
      setClientName(result.nomeCliente);
      setTelefone(result.telCliente);
      setObservation(result.descricao);
      
      const rServicos = viewServicoAgendamento(id);
      const rColaboradores = viewColaboradorAgendamento(id);

      const selectedServicesList = {};
      rServicos.forEach((servico) => {
        selectedServicesList[servico.codServico] = true;
      })
      setSelectedServices(selectedServicesList);

      const selectedColaboradoresList = {};
      rColaboradores.forEach((colaborador) => { 
        selectedColaboradoresList[colaborador.codColaborador] = true;
      });
      setSelectedColaboradores(selectedColaboradoresList);

      setIdAgendamento(id);
    }
  }, [route.params]);

  useEffect(() => {
    const resultTiposServico = viewServicoAll();
    if (resultTiposServico.length > 0) {
      setTiposServico(resultTiposServico);
    } else {
      setTiposServico([
        {
          id: null,
          nome: "Sem serviço cadastrado"
        }
      ]);
    }

    const resultColaboradores = viewColaboradorAll();
    if (resultColaboradores.length > 0) {
      setColaboradores(resultColaboradores);
    } else {
      setColaboradores([{
        id: 1, nome: 'Sem colaborador cadastrado',
      }]);
    }

  }, [refresh]);

  const handleCheckboxChange = (id) => {
    setSelectedServices(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCheckboxChangeColaborador = (id) => {
    setSelectedColaboradores(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }
  const handleStartTimePickerChange = (event, selectedDate) => {
    setTimePickerVisible(false);
    if (event.type === 'set' && selectedDate) { 
      const formattedTime = selectedDate.toISOString().split('T')[1].substring(0, 5);
      
        setTime(formattedTime);
    }
  };

  const handleSave = () => {
    let hasErrors = false;
    if (!selectedDate || !clientName || !telefone || telefone.length < 15 || Object.keys(selectedServices).length === 0 || Object.keys(selectedColaboradores).length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios corretamente.');
      hasErrors = true;
    }
    if (hasErrors) return;

    const selectedServicesArray = Object.keys(selectedServices).filter((key) => selectedServices[key]);
    const selectedColaboradoresArray = Object.keys(selectedColaboradores).filter((key) => selectedColaboradores[key]);

    if (idAgendamento) {
      if(updateAgendamento(idAgendamento,selectedDate,time,clientName,telefone,observation,selectedServicesArray,selectedColaboradoresArray))
      Toast.show("Atualizado com sucesso!");
      navigation.navigate('Home');
    } else {
      

      if (addAgendamento(selectedDate, time, clientName, telefone, observation, selectedServicesArray, selectedColaboradoresArray)) {
        Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', 'Erro ao realizar o agendamento.');
      }
    }

    
  };

  const handleClear = () => {
    setSelectedDate(null);
    setClientName('');
    setTelefone('');
    setObservation('');
    setSelectedServices({});
    setTime(localeDate);
    setSelectedColaboradores({});
    route.params = {};
  }

  

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
    >
      <StatusBar style='auto' backgroundColor='#F7FF89' />
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() =>{navigation.navigate('Home')}} />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            onDayPress={(day) => setSelectedDate(day.dateString)}
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
        <View style={styles.tiposServicoContainer}>
          <View>
            <Text style={styles.label}>Serviços Disponíveis</Text>
          </View>
          <View>
            <BtnAddServ refresh={refresh} setRefresh={setRefresh} />
          </View>
        </View>

        <View style={styles.serviceScrollArea}>
          <ScrollView
            style={{
              width: '100%',
              height: 150,
          }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
        >
          {tiposServico.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <Checkbox
                status={!!selectedServices[service.id] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(service.id)}
              />
              <Text style={styles.serviceText}>{service.nome}</Text>
            </View>
          ))}
        </ScrollView>
        </View>
       
        <View style={styles.tiposServicoContainer}>
          <View>
            <Text style={styles.label}>Colaboradores Disponíveis</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Colaboradores')}>
              <Text style={styles.buttonText}>
                <AntDesign style={styles.text} name="plussquare" size={24} color="white" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.serviceScrollArea}>
          <ScrollView
            style={{
              width: '100%',
              height: 150,
          }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
        >
          {colaboradores.map((colaborador) => (
            <View key={colaborador.id} style={styles.serviceItem}>
              <Checkbox
                status={!!selectedColaboradores[colaborador.id] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChangeColaborador(colaborador.id)}
              />
              <Text style={styles.serviceText}>{colaborador.nome}</Text>
            </View>
          ))}
        </ScrollView>
        </View>

        <Text style={styles.label}>Nome do Cliente</Text>
        <TextInput
          style={styles.timeInput}
          value={clientName}
          onChangeText={(text) => setClientName(text)}
          placeholder="Nome do Cliente"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          style={erroTelefone ? [styles.timeInput, styles.inputError] : styles.timeInput}
          value={telefone}
          onChangeText={(text) => setTelefone(text)}
          placeholder="Telefone"
          keyboardType="numeric"
        />

        <View>
          <Text style={styles.label}>Horário</Text>
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

        <Text style={styles.label}>Observação</Text>
        <TextInput
          style={styles.observationInput}
          value={observation}
          onChangeText={(text) => setObservation(text)}
          placeholder="Adicione uma observação"
          multiline
        />
        
        <View style={styles.btnActionContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.ButtonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.saveButtonGradient}>
              <Text style={styles.saveButtonText}>Salvar</Text>
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
  serviceScrollArea: {
    width: '100%',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceText: {
    marginLeft: 10,
    fontSize: 16,
  },
  btnActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  saveButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '50%',
    height: 50,
  },
  saveButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    color: '#6D6B69',
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: 'center',
    width: '45%',
    borderColor: '#6D6B69',
    borderWidth: 2,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000',
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
  inputError: {
    borderColor: 'red',
  },
  tiposServicoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default Agendamento;
