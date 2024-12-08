import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-root-toast';
import { DataTheme } from '../../context';
import light from '../../theme/light';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getClientes, getClientesPorData, getClientesPorDataENome, getClientesPorNome } from '../../database';


export default function Clientes({ navigation }) {
  const { theme } = useContext(DataTheme);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const background = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];

  // Função para filtrar os clientes
  const handleFilter = () => {

    const dataInicio = startDate ? startDate.toISOString().split('T')[0] : null;
    const dataFim = endDate ? endDate.toISOString().split('T')[0] : null;
    const dataAtual = new Date().toISOString().split('T')[0];

    if (!startDate && !endDate && !search) {
      console.log('Sem filtro');
      Toast.show('Preencha ao menos um campo para filtrar', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
    }
    if (startDate && endDate && search) {
      const result = getClientesPorDataENome(dataInicio, dataFim, search);
      setFilteredClientes(result || []);
      console.log('Filtrado por data e nome');
      Toast.show('Filtrado por data e nome', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }

    if (startDate && endDate && !search) {
        const result = getClientesPorData(dataInicio, dataFim);
        setFilteredClientes(result || []);
        console.log('Filtrado por data');
        Toast.show('Filtrado por data', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#FF0000',
        });
        return;
      }
   
    if (!startDate && !endDate && search) {
      const result = getClientesPorNome(search);
      setFilteredClientes(result || []);
      console.log('Filtrado por nome');
      Toast.show('Filtrado por nome', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }

    if (startDate && !endDate && search) {
      const result = getClientesPorDataENome(dataInicio, dataAtual, search);
      setFilteredClientes(result || []);
      console.log('Filtrado por data e nome');
      Toast.show('Filtrado por data e nome', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }

    if (!startDate && endDate && search) {
      const result = getClientesPorDataENome(dataAtual, endDate, search);
      setFilteredClientes(result || []);
      console.log('Filtrado por data e nome');
      Toast.show('Filtrado por data e nome', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleInit =  () => {
    setStartDate(null);
    setEndDate(null);
    setSearch('');
    try {
      const result = getClientes();
      console.log(result);
      setFilteredClientes(result || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setFilteredClientes([{ id: '1', nomeCliente: 'Sem clientes atendidos', telCliente: '', dataAtendimento: '' }]);
    }
  };

  useEffect(() => {
    handleInit();
  },[]);



  const renderCliente = ({ item }) => (
    <ClienteItem>
      <ClienteText>{item.nomeCliente}</ClienteText>
      <ClienteText>{item.telCliente}</ClienteText>
      <ClienteText>{item.dataAgendamento}</ClienteText>
    </ClienteItem>
  );

  return (
    <Page>
      <LinearGradient colors={background} style={styles.containerHeader}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
        <Title>Clientes</Title>
      </LinearGradient>
      <Filters>
        <StyledInput
          placeholder="Buscar por nome"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
        />
        <FilterRow>
            <FilterButton onPress={() => setShowStartPicker(true)}>
              <AntDesign name="calendar" size={24} color="#fff" />
              <FilterText>Data Inicial</FilterText>
            </FilterButton>
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
          )}
          
            <FilterButton onPress={() => setShowEndPicker(true)}>
              <AntDesign name="calendar" size={24} color="#fff" />
              <FilterText>Data Final</FilterText>
            </FilterButton>
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
          )}
        </FilterRow>
        <FilterDate>
          <Text>{startDate ? startDate.toLocaleDateString('pt-BR') : ''}</Text>
          <Text>{endDate ? endDate.toLocaleDateString('pt-BR') : ''}</Text>
        </FilterDate>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <Btn onPress={handleFilter}>
            <AntDesign name="filter" size={24} color="#fff" />
            <BtnText>Filtrar</BtnText>
          </Btn>
          <BtnLimpar onPress={handleInit}>
            <AntDesign name="delete" size={24} color="#fff" />
            <BtnText>Limpar</BtnText>
          </BtnLimpar>
        </View>
      </Filters>
      <Container>
        {filteredClientes.length > 0 ? (
          <View>
            <HeaderList>
              <HeaderText>Nome</HeaderText>
              <HeaderText>Telefone</HeaderText>
              <HeaderText>Atendimento</HeaderText>
            </HeaderList>
            <FlatList
              data={filteredClientes}
              keyExtractor={(item) => item.id}
              renderItem={renderCliente}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </View>
        ) : (
          <Title>Nenhum cliente encontrado</Title>
        )}
      </Container>
        <Toast />
    </Page>
  );
}

const Page = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const Container = styled.View`
  flex: 1;
  padding: 24px;
`;

const Filters = styled.View`
  padding: 16px;
  width: 100%;
`;

const FilterRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledInput = styled.TextInput`
  height: 50px;
  border-Color: ${(props) => props.theme.borderColor};
  border-Width: 1px;
  border-Radius: 5px;
  background-Color: ${(props) => props.theme.inputBackground};
  padding: 10px;
  margin-Bottom: 10px;
  color: ${(props) => props.theme.text};
`;

const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.buttonBackground};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 48%;
`;

const FilterText = styled.Text`
  color: ${(props) => props.theme.buttonText};
  margin-left: 8px;
`;

const ClienteItem = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.buttonBackground};
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ClienteText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.buttonText};
  margin-bottom: 4px;
  max-width: 30%;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: ${(props) => props.theme.text};
`;

const HeaderList = styled.View`
  flex-direction: row;
  justify-content: space-between;
  
`;
const HeaderText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  width: 30%;
  color: ${(props) => props.theme.text};
`;

const Text = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

const FilterDate = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;
const Btn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.buttonBackground};
  padding: 12px;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 48%;
`;
const BtnText = styled.Text`
  color: ${(props) => props.theme.buttonText};
  margin-left: 8px;
`;

const BtnLimpar = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.secondary};
  padding: 12px;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 48%;
`;

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 48,
  },
});
