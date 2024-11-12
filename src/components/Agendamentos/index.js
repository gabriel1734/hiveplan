import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { deleteAgendamento, setAtendimento, viewColaborador, viewColaboradorAgendamento, viewServicoAgendamento, viewServicoID } from "../../database";
import Toast from "react-native-root-toast";
import styled from "styled-components";

export default Agendamento = ({ horaAgendamento, dataAgendamento, telCliente, nomeCliente, descricao, id, atendimento, onRefresh, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    const fetchColaboradores = async () => {
      const codColaboradores = viewColaboradorAgendamento(id);
      const colaboradoresList = codColaboradores.map(cod => viewColaborador(cod.codColaborador));
      setColaboradores(colaboradoresList);
    };

    const fetchServicos = async () => {
      const servicosList = viewServicoAgendamento(id);
      const servicosDetail = servicosList.map(servico => viewServicoID(servico.codServico));
      setServicos(servicosDetail);
    };

    fetchColaboradores();
    fetchServicos();
  }, [id]);

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Agendamento",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            if (deleteAgendamento(id)) {
              Toast.show("Deletado com sucesso!");
              onRefresh();
            }
          }
        }
      ]
    );
  };

  const handleEdit = (id) => {
    setModalVisible(false);
    navigation.navigate("Agendamento", { id });
  };

  const handleAtendimento = (id, atendimento) => {
    if (setAtendimento(id, atendimento)) {
      Toast.show("Atendimento concluído!");
      onRefresh();
    }
    setModalVisible(false);
  };

  // Formatar a data
  dataAgendamento = dataAgendamento.split('T')[0];

  // Lógica para definir estilo com base no estado do atendimento e se está atrasado
  let style = styles.agendamento;

  const isAtrasado = () => {
    const agora = new Date();
    const horaAtual = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dataAtual = agora.toISOString().split("T")[0];

    // Compara se a hora do agendamento é anterior à hora atual e se a data é a mesma
    return (dataAgendamento <= dataAtual && horaAgendamento < horaAtual && !atendimento);
  };

  // Ajustando o estilo
  if (atendimento) {
    style = styles.agendamentoConcluido; // Concluído
  } else if (isAtrasado()) {
    style = styles.agendamentoAtrasado; // Atrasado
  }

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
    <StyledAgendamento>
      
        <Horario>{horaAgendamento}</Horario>
        <TextCliente >
          <AntDesign name="user" size={14} color="white" /> {nomeCliente}
        </TextCliente>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StyledModal>
          <StyledModalView>
            <ModalText >Detalhes do Agendamento</ModalText>
            <InfoText>
              <MaterialIcons name="phone" size={14} color="black" /> Telefone: {telCliente}
            </InfoText>
            <InfoText>
              <MaterialIcons name="date-range" size={14} color="black" /> Data: {dataAgendamento}
            </InfoText>
            <InfoText>
              <MaterialIcons name="work" size={14} color="black" /> Serviço: {servicos.map((servico, index) => (
                <Text key={index}>
                  {servico?.nome} {index < servicos.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </InfoText>
            <InfoText>
              <MaterialIcons name="people" size={14} color="black" /> Colaboradores: {colaboradores.map((colaborador, index) => (
                <Text key={index}>
                  {colaborador?.nome} {index < colaboradores.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </InfoText>
            <InfoText>
              <MaterialIcons name="description" size={14} color="black" /> Descrição: {descricao}
            </InfoText>
            <Container>
              {!atendimento ? (
                <Text style={styles.btnConcluir} onPress={() => handleAtendimento(id, 1)}>
                  Concluir
                </Text>
              ) : (
                <Text style={styles.btnDesfazer} onPress={() => handleAtendimento(id, 0)}>
                  Desfazer
                </Text>
              )}
              <Text style={styles.btnAction} onPress={() => handleEdit(id)}>Editar</Text>
              <Text style={styles.btnActionDelete} onPress={() => handleDelete(id)}>Excluir</Text>
              <BotaoFechar onPress={() => setModalVisible(false)}>Fechar</BotaoFechar>
            </Container>
          </StyledModalView>
        </StyledModal>
      </Modal>
    </StyledAgendamento>
 </TouchableOpacity>

  );
};

const StyledAgendamento = styled.View`
  background-color: ${props => props.theme.buttonBackground};
  padding: 15px;
  margin-bottom:10px;
  border-radius: 16px;
  align-content: center;
  align-items: center;
`;

const Horario = styled.Text`
  padding-Bottom: 5px;
  font-Weight: bold;
  font-Size: 20px;
  color: ${props => props.theme.buttonText};
`;

const TextCliente = styled.Text`
  color: ${props=>props.theme.buttonText};
`;

const StyledModal = styled.View`
  flex: 1;
  justify-Content: center;
  align-Items: center;
  background-Color: rgba(0, 0, 0, 0.5);
`;

const StyledModalView = styled.View`
  background-Color: ${props=> props.theme.background};
  border-Radius: 20px;
  padding: 20px;
  align-Items: center;
  width: 80%;
`;

const ModalText = styled.Text`
  color: ${props => props.theme.text};
  margin-Bottom: 15;
  text-Align: center;
  font-Size: 24;
`;

const InfoText = styled.Text`
  color: ${props => props.theme.text};
  font-Size: 16px;
  align-Self: baseline; 
`;

const Container = styled.View`
  margin-Top: 20;
  flex-Direction: column;
  justify-Content: space-between;
  align-Items: center;
  width: 100%;
`;

const BotaoFechar = styled.Text`
  padding: 10px;
  border-Radius: 10px;
  background-Color: ${props=>props.theme.primary};
  text-Align: center;
  width: 90%;
  color: white;
  border-Color: #6D6B69;
  border-Width: 1px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const styles = StyleSheet.create({
  agendamento: {
    backgroundColor: '#6D6B69',
    padding: 15,
    borderRadius: 16,
    alignContent: "center",
    alignItems: "center",
  },
  agendamentoConcluido: {
    backgroundColor: 'green',  // Fundo branco para agendamentos concluídos
    borderColor: 'black', // Borda verde
    borderWidth: 2,
    padding: 15,
    borderRadius: 16,
    alignContent: "center",
    alignItems: "center",
  },
  agendamentoAtrasado: {
    backgroundColor: 'red', // Fundo vermelho para agendamentos atrasados
    borderColor: 'yellow', // Borda amarela
    borderWidth: 2,
    padding: 15,
    borderRadius: 16,
    alignContent: "center",
    alignItems: "center",
  },
  horario: {
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  nomeCliente: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Largura do modal
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
  },
  infoText: {
    marginVertical: 0,
    color: 'black',
    fontSize: 16,
    alignSelf: "baseline", 
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  btnAction: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    color: 'white',
    textAlign: 'center',
    width: '90%',
    marginVertical: 5, // Espaçamento entre os botões
  },
  btnActionDelete: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ED213A",
    color: 'white',
    textAlign: 'center',
    width: '90%',
    marginVertical: 5,
  },
  btnActionCancel: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: 'center',
    width: '90%',
    color: '#6D6B69',
    borderColor: '#6D6B69',
    borderWidth: 1,
    marginVertical: 5,
  },
  btnConcluir: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#228B22",
    color: 'white',
    textAlign: 'center',
    width: '90%',
    marginVertical: 5,
  },
  btnDesfazer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFD700",
    color: 'white',
    textAlign: 'center',
    width: '90%',
    marginVertical: 5,
  },
});

