import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import styled from 'styled-components/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import { viewServicoAll, viewColaboradorAll, updateColaborador, addColaborador, viewColaborador, addServicoColaborador, viewServicoColaborador, delColaborador } from "../../database";
import Toast from "react-native-root-toast";

export default function Colaboradores({ navigation }) {
  const [tiposAgendamentos, setTiposAgendamentos] = useState([]);
  const [selectedServicos, setSelectedServicos] = useState({});
  const [favoriteSevicosColaborador, setFavoriteSevicosColaborador] = useState({});
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState('');
  const [id, setId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const loadAgendamentos = () => {
    setTiposAgendamentos(viewServicoAll());
  };

  const loadColaboradores = () => {
    setColaboradores(viewColaboradorAll());
  };

  useEffect(() => {
    loadAgendamentos();
    loadColaboradores();
  }, [refresh]);

  const handleCheckboxChange = (id) => {
    setSelectedServicos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));  
  };

  const handleStarPress = (id) => {
    setFavoriteSevicosColaborador(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSave = () => {
    if (!nome) {
      Alert.alert('Nome do colaborador é obrigatório!');
      return;
    }
    if (Object.keys(selectedServicos).length === 0) {
      Alert.alert('Selecione pelo menos um serviço!');
      return;
    }
    if (id) {
      if (updateColaborador(id, nome)) {
        Toast.show("Atualizado!");
      } else {
        Toast.show("Erro!");
      }
    } else {
      const idColaborador = addColaborador(nome);
      if (idColaborador) {
        Object.keys(selectedServicos).forEach((idServico) => {
          if (selectedServicos[idServico]) {
            addServicoColaborador(idColaborador, idServico, favoriteSevicosColaborador[idServico] ? 1 : 0);
          }
        });
        Toast.show("Adicionado com sucesso!");
      } else {
        Alert.alert('Erro', 'Erro ao adicionar colaborador'); 
      }
    }
    setNome(''); 
    setId('');
    setFavoriteSevicosColaborador({});
    setSelectedServicos({});
    setRefresh(!refresh);
  };

  const handleEdit = (id) => {
    const r = viewColaborador(id)
    const rServicos = viewServicoColaborador(id);
    rServicos.forEach((servico) => {
      setSelectedServicos(prevState => ({
        ...prevState,
        [servico.codServico]: true,
      }));
      setFavoriteSevicosColaborador(prevState => ({
        ...prevState,
        [servico.codServico]: servico.favorito === 1 ? true : false,
      }));
    });
    setId(r.id);
    setNome(r.nome);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Serviço",
      "Você tem certeza que deseja excluir este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
          if (delColaborador(id)) {
            Toast.show("Excluído com sucesso!");
            setRefresh(!refresh);
            onRefresh();
            handleClear();
          }
        }},
      ]
    );
  };

  const handleClear = () => {
    setNome('');
    setId('');
    setFavoriteSevicosColaborador({});
    setSelectedServicos({});
  };

  const onRefresh = () => {
    setRefreshList(true);
    setTimeout(() => {
      loadAgendamentos();
      loadColaboradores();
      setRefreshList(false);
    }, 1000);
  };

  return (
    <>
      <Header colors={['#F7FF89', '#F6FF77', '#E8F622']}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() => { navigation.goBack() }} />
      </Header>
      <Container refreshControl={<RefreshControl refreshing={refreshList} onRefresh={onRefresh} />}>
        <InputContainer>
          <Label>Nome do colaborador:</Label>
          <StyledInput 
            placeholder="Nome do colaborador" 
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
          />
        </InputContainer>
        <Label>Serviços do Colaborador:</Label>
        <StyledScrollView>
          {tiposAgendamentos.map((agendamento) => (
            <AgendamentoItem key={agendamento.id}>
              <Checkbox
                status={!!selectedServicos[agendamento.id] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(agendamento.id)}
              />
              <AgendamentoText>{agendamento.nome}</AgendamentoText>
              <TouchableOpacity onPress={() => handleStarPress(agendamento.id)}>
                <AntDesign
                  name="star"
                  size={24}
                  color={favoriteSevicosColaborador[agendamento.id] ? 'yellow' : 'black'}
                />
              </TouchableOpacity>
            </AgendamentoItem>
          ))}
        </StyledScrollView>
        <ButtonContainer>
          <ActionButtonCancel onPress={() => navigation.navigate('Agendamento')}>
            Cancelar
          </ActionButtonCancel>
          <ActionButtonSave onPress={handleSave}>
            Salvar
          </ActionButtonSave>
        </ButtonContainer>
        <Label>Colaboradores cadastrados:</Label>      
        <StyledScrollView>
          {colaboradores.map((colaborador) => (
            <AgendamentoItem key={colaborador.id}>
              <AgendamentoText>{colaborador.nome}</AgendamentoText>
              <ActionButtons>
                <EditButton onPress={() => handleEdit(colaborador.id)}>Editar</EditButton>
                <ExcludeButton onPress={() => handleDelete(colaborador.id)}>Excluir</ExcludeButton>
              </ActionButtons>
            </AgendamentoItem>
          ))}
        </StyledScrollView>
      </Container>
    </>
  );
}


const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  background-color: ${props => props.theme.background};
`;

const Header = styled(LinearGradient)`
  padding: 35px;
  border-radius: 10px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const StyledInput = styled.TextInput`
  height: 40px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  padding: 0 10px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
`;

const StyledScrollView = styled.ScrollView`
  margin-top: 10px;
  background-color: ${props => props.theme.background};
  max-height: 200px;
`;

const AgendamentoItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.agendamentoBackground};
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const AgendamentoText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.agendamentoText};
  margin-left: 10px;
`;

const StarDesign = styled(AntDesign)`
  color: ${props=> props.theme.text};
`;

const ButtonContainer = styled.View`
  padding-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 20px;
`;

const ActionButtonSave = styled.Text`
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme.buttonBackground};
  text-align: center;
  width: 45%;
  color: ${props => props.theme.buttonText};
`;

const ActionButtonCancel = styled.Text`
  color: ${props => props.theme.primary};
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme.buttonText};
  text-align: center;
  width: 45%;
  border: 2px solid ${props => props.theme.primary};
  font-weight: bold;
`;

const ActionButtons = styled.View`
  flex-direction: row;
`;

const EditButton = styled.Text`
  background-color: ${props => props.theme.buttonText};
  padding: 10px;
  border-radius: 5px;
  color: ${props => props.theme.primary};
  margin-right: 5px;
`;

const ExcludeButton = styled.Text`
  background-color: ${props => props.theme.secondary};
  padding: 10px;
  border-radius: 5px;
  color: ${props => props.theme.buttonText};
`;

