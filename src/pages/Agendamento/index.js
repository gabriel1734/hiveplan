import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Checkbox } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import { addAgendamento, viewServicoAll, viewAgendamentoID, viewColaboradorAll, editarAgendamento, updateAgendamento, viewServicoAgendamento, viewColaboradorAgendamento } from '../../database';
import BtnAddServ from '../../components/BtnAddServ';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-root-toast';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import { DataTheme } from '../../context';
import light from '../../theme/light';

const Agendamento = ({ navigation, route }) => {
  const hoje = new Date().toISOString().split('T')[0];
  const date = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [selectedDate, setSelectedDate] = useState(hoje);
  const [clientName, setClientName] = useState('');
  const [time, setTime] = useState(date);
  const [observation, setObservation] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tiposServico, setTiposServico] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [idAgendamento, setIdAgendamento] = useState(null);
  const [erroTelefone, setErroTelefone] = useState(false);
  const [colaboradores, setColaboradores] = useState([]);
  const [selectedColaboradores, setSelectedColaboradores] = useState({});
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const { theme } = useContext(DataTheme);
  const backgroundColor = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];

  useEffect(() => {
    const { id, refreshColab } = route.params || {};
    if (refreshColab) {
      setRefresh(!refresh);
    }
    if (id) {
      const result = viewAgendamentoID(id);
      setSelectedDate(result.dataAgendamento);
      setTime(result.horaAgendamento)
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
      setTiposServico(resultTiposServico.sort((a) => a.favorito ? -1 : 1));
    } else {
      setTiposServico([{ id: null, nome: "Sem serviço cadastrado" }]);
    }

    const resultColaboradores = viewColaboradorAll();
    if (resultColaboradores.length > 0) {
      setColaboradores(resultColaboradores);
    } else {
      setColaboradores([{ id: 1, nome: 'Sem colaborador cadastrado' }]);
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
  };

  const handleStartTimePickerChange = (event, selectedDate) => {
    setTimePickerVisible(false);
    if (event.type === 'set' && selectedDate) { 
      const formattedTime = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      if(updateAgendamento(idAgendamento, selectedDate, time, clientName, telefone, observation, selectedServicesArray, selectedColaboradoresArray))
        Toast.show("Atualizado com sucesso!");
      navigation.navigate('Home', { refresh: true });
    } else {
      if (addAgendamento(selectedDate, time, clientName, telefone, observation, selectedServicesArray, selectedColaboradoresArray)) {
        Toast.show("Agendamento realizado com sucesso!",{ position: Toast.positions.TOP, backgroundColor: "green", duration: Toast.durations.LONG });
        navigation.navigate('Home', { refresh: true });
      } else {
        Toast.show("Erro ao realizar agendamento!",{ position: Toast.positions.TOP, backgroundColor: "red", duration: Toast.durations.LONG });
      }
    }
  };

  const handleClear = () => {
    setSelectedDate(hoje);
    setClientName('');
    setTelefone('');
    setObservation('');
    setSelectedServices({});
    setTime(date);
    setSelectedColaboradores({});
    route.params = {};
  };

  return (
    <Container  nestedScrollEnabled={true}>
      <StatusBar style='auto' backgroundColor={theme === light ? '#F7FF89': '#bb86fc'} />
      <Header colors={backgroundColor}>
        <Goback>
          <DesignColor name="arrowleft" size={24} onPress={() => { navigation.goBack() }} />        
        </Goback>
        <CalendarContainer>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#000', selectedTextColor: '#fff' },
            }}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#000',
              selectedDayBackgroundColor: `${theme.text}`,
              selectedDayTextColor: `${theme.background}`,
              todayTextColor: '#000',
              dayTextColor: '#000',
              arrowColor: 'black',
              monthTextColor: '#000',
            }}
          />
        </CalendarContainer>
      </Header>
      <Content>
        <ServiceHeader>
          <Label>Serviços Disponíveis</Label>
          <AddButton onPress={() => navigation.navigate('Servicos')}>
            <ButtonText>
              <AntDesign name="plussquare" size={24} color="white" />
            </ButtonText>
          </AddButton>
        </ServiceHeader>

        <ServiceScroll   showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}>
          {tiposServico.map((service) => (
            <ServiceItem key={service.id}>
              <Checkbox
                status={!!selectedServices[service.id] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(service.id)}
              />
              <ServiceText>{service.nome}</ServiceText>
              {service.favorito == 1 && <StyledStar name="star" size={24} />}
            </ServiceItem>
          ))}
        </ServiceScroll>

        <ServiceHeader>
          <Label>Colaboradores Disponíveis</Label>
          <AddButton onPress={() => navigation.navigate('Colaboradores')}>
            <AntDesign name="plussquare" size={24} color="white" />
          </AddButton>
        </ServiceHeader>

        <ServiceScroll showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}>
          {colaboradores.map((colaborador) => (
            <ServiceItem key={colaborador.id}>
              <Checkbox
                status={!!selectedColaboradores[colaborador.id] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChangeColaborador(colaborador.id)}
              />
              <ServiceText>{colaborador.nome}</ServiceText>
            </ServiceItem>
          ))}
        </ServiceScroll>

        <Label>Nome do Cliente</Label>
        <Input placeholderTextColor="#888" value={clientName} onChangeText={(text) => setClientName(text)} placeholder="Nome do Cliente" />

        <Label>Telefone</Label>
        <StyledTextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          value={telefone}
          onChangeText={(text) => setTelefone(text)}
          placeholder="(99) 9 9999-9999"
          placeholderTextColor="#888"
          style={erroTelefone ? { borderColor: 'red' } : {}}
        />
        
        <Label>Hora do Agendamento</Label>
        <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
          <Input placeholderTextColor="#888" value={time} editable={false} />
        </TouchableOpacity>
        {isTimePickerVisible && (
          <RNDateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleStartTimePickerChange}
          />
        )}

        <Label>Observações</Label>
        <ObservationInput placeholderTextColor="#888" multiline={true} value={observation} onChangeText={(text) => setObservation(text)} placeholder="Adicione uma observação" />

        <Footer>
          <ActionButtonClean onPress={handleClear} >
            Limpar
          </ActionButtonClean>
          <ActionButtonSave onPress={handleSave}>
            Salvar
          </ActionButtonSave>
        </Footer>
      </Content>
    </Container>
  );
};

// Estilização com styled-components

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const Header = styled(LinearGradient)`
  padding: 35px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Goback = styled.View`
  align-items: flex-start;
`;

const CalendarContainer = styled.View`
  align-items: center;
  margin-top: 10px;
`;

const Content = styled.SafeAreaView`
  padding: 10px;
  flex: 1;
`;

const ServiceHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const ServiceScroll = styled.ScrollView`
  max-height: 120px;
  margin-bottom: 15px;
`;

const ServiceItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const Label = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.text};
  margin-bottom: 5px;
`;

const Input = styled(TextInput)`
  height: 40px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  padding: 0px 10px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
`;

const ObservationInput = styled(TextInput)`
  height: 40px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  padding: 10px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  height: 80px;
  border-Width: 1px;
  margin-Bottom: 10px;
  text-align: top;
`

const StyledTextInputMask = styled(TextInputMask)`
  height: 40px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  padding: 0px 10px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
`;

const Button = styled(TouchableOpacity)`
  padding: 10px;
  border-radius: 5px;
  background-color: blue;
  align-items: center;
  flex: 1;
  margin: 0px 5px;
`;

const ActionButtonClean = styled.Text`
  color: ${props => props.theme.primary};
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme.buttonText};
  text-align: center;
  width: 45%;
  border: 2px solid ${props => props.theme.primary};
  font-weight: bold;
`;

const ActionButtonSave = styled.Text`
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme.buttonBackground};
  text-align: center;
  width: 45%;
  color: ${props => props.theme.buttonText};
`;

const ButtonText = styled(Text)`
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const ServiceText = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.text};
  flex: 1;
`;

const AddButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.buttonBackground};
  padding: 5px;
  border-radius: 5px;
`;

const DesignColor = styled(AntDesign)`
  color: ${props=> props.theme.text};
`;

const StyledStar = styled(AntDesign)`
  color: ${props => props.theme.starcolor}
`

export default Agendamento;
