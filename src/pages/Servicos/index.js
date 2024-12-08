import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Modal, View, TextInput, ScrollView, Alert, RefreshControl } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { addServico, adicionarTipoAgendamento, deleteServico, editarTipoAgendamento, deleteAgendamento, excluirTipoAgendamento, updateServico, verTipoAgendamento, verTipoAgendamentos, viewServicoAll, viewServicoID, updateServicoFavorito } from "../../database";
import Toast from "react-native-root-toast";
import { Checkbox } from "react-native-paper";
import styled from 'styled-components/native';

const Servicos = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [id, setId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tiposAgendamentos, setTiposAgendamentos] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [favoritos, setFavoritos] = useState({});
  const [favorito, setFavorito] = useState(0);


  const handleToggleFavorito = (id) => {
    setFavoritos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    updateServicoFavorito(id, tiposAgendamentos.find(servico => servico.id === id).favorito == 1 ? 0 : 1);
    onRefresh();
  };

  // Função para carregar todos os agendamentos
  const loadAgendamentos = () => {
    setTiposAgendamentos(viewServicoAll());
    const favoritosTemp = {};
    tiposAgendamentos.forEach((servico) => {
      favoritosTemp[servico.id] = servico.favorito == 1 ? true : false;
    });
    setFavoritos(favoritosTemp);
  };

  // Carregar os agendamentos ao montar o componente
  useEffect(() => {
    loadAgendamentos();
  }, [refreshList]);

  const handleSave = () => {

    if (id) {
      if(updateServico(id,nome,descricao, favorito))
        Toast.show("Atualizado!")
      else
      Toast.show("Erro!");
    } else {
      if(addServico(nome, descricao, favorito))
        Toast.show("Adicionado!");
      else 
      Toast.show("Erro!");
    }
    setNome(''); 
    setDescricao('');
    setId('');
    setFavorito(0);
    onRefresh();
  };

  const handleEdit = (id) => {
    const r = viewServicoID(id)
    setId(r.id);
    setNome(r.nome);
    setDescricao(r.descricao);
    setFavorito(r.favorito);
  }

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Serviço",
      "Você tem certeza que deseja excluir este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
           if(deleteServico(id))
            Toast.show("Exluido com sucesso!") // Exclui do banco de dados
            console.log('Excluiu');
            onRefresh();
          }
        }
      ]
    );
  };

  const handleClear = () => {
    setNome('');
    setDescricao('');
    setId('');
    setFavorito(0);
  }

  const onRefresh = () => {
  setRefreshList(true);
  setTimeout(() => {
    setRefreshList(false);
  }, 500);
  };


  return (
        <Container>
          <Arrow>
            <DesignColor name="arrowleft" size={32} onPress={() => {navigation.goBack()}}/>
          </Arrow>
          <Label>Adicionar Tipo de Serviço</Label>
          <Text
            placeholder="ID"
            style={{ display: 'none' }}
            value={id}
          />
          <StyledInput
            placeholder="Nome do Serviço"
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
          />
          <StyledInput
            placeholder="Descrição"
            placeholderTextColor="#888"
            value={descricao}
            onChangeText={setDescricao}
          />
          <FavoritoContainer>
            <FavoritoText>
              Favorito
            </FavoritoText>
            <Checkbox
              status={favorito ? 'checked' : 'unchecked'}
              onPress={() => setFavorito(favorito ? 0 : 1)}
            />
          </FavoritoContainer>
          <ButtonContainer>
            <ActionButtonCancel onPress={() => handleClear()}>
              Cancelar
            </ActionButtonCancel>
            <ActionButtonSave onPress={handleSave}>
              Salvar
            </ActionButtonSave>
          </ButtonContainer>
          <ScrollContainer>
            <StyledScrollView
              refreshControl={
              <RefreshControl refreshing={refreshList} onRefresh={onRefresh} />
              }
            >
              {tiposAgendamentos.map((servico) => (
                <AgendamentoItem key={servico.id}>
                  <ServicoContainer>
                    <ServicoText>{servico.nome}</ServicoText>
                    <TouchableOpacity onPress={() => handleToggleFavorito(servico.id)}>
                      <StyledStar
                        name={servico.favorito == 1 ? 'star' : 'staro'}
                        size={24}
                      />
                    </TouchableOpacity>
                  </ServicoContainer>
                  <ServicoText>{servico.descricao}</ServicoText>
                  <ActionButtons>
                    <EditButton onPress={() => handleEdit(servico.id)}>Editar</EditButton>
                    <ExcludeButton onPress={() => handleDelete(servico.id)}>Excluir</ExcludeButton>
                  </ActionButtons>
                </AgendamentoItem>
              ))}
          </StyledScrollView>
          </ScrollContainer>
        </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color:${props=>props.theme.background};
  padding: 35px;
  align-Items: center;
  width: 100%;
  height: 100%;
`;

const Arrow = styled.View`
  flex-Direction: row;
  justify-Content: space-between;
  width: 100%;
`;

const Label = styled.Text`
  margin-Bottom: 15px;
  text-Align: center;
  font-Size: 18px;
  font-Weight: bold;
  color: ${props => props.theme.text};
`;
const StyledInput = styled.TextInput`
  height: 40px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  padding: 0px 10px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  height: 40px;
  border-Width: 1px;
  margin-Bottom: 15px;
  width: 100%;
  padding-Left: 10px;
`;

const FavoritoContainer = styled.View`
    flex-Direction: row;
    justify-Content: flex-end;
    align-Items: center;
    margin-Bottom: 15px;
    width: 100%;
`;

const FavoritoText = styled.Text`
  font-Size: 16px;
  color: ${props => props.theme.text};
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 20px;
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

const ActionButtonSave = styled.Text`
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme.buttonBackground};
  text-align: center;
  width: 45%;
  color: ${props => props.theme.buttonText};
`;

const ScrollContainer = styled.View`
  margin-Top: 20px;
  width: 100%;
  margin-Bottom: 20px;
`;

const StyledScrollView = styled.ScrollView`
  width: 100%;
  height: 60%;
`;

const AgendamentoItem = styled.View`
  background-color: ${props => props.theme.agendamentoBackground};
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;
const ServicoContainer = styled.View`
  flex-Direction: row;
  justify-Content: space-between;
`;
const ServicoText = styled.Text`
  font-Size: 16px;
  margin-Bottom: 5px;
  color: ${props => props.theme.agendamentoText};
`;

const ActionButtons = styled.View`
  flex-Direction: row;
  justify-Content: space-between;
  margin-Top: 10px;
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

const DesignColor = styled(AntDesign)`
  color: ${props=> props.theme.text};
`;

const StyledStar = styled(AntDesign)`
  color: ${props => props.theme.starcolor}
`

export default Servicos;
