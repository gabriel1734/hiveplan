import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { deleteAgendamento, setAtendimento, viewColaborador, viewColaboradorAgendamento, viewServicoAgendamento, viewServicoID } from "../../database";
import Toast from "react-native-root-toast";

export default Agendamento = ({ horaAgendamento, dataAgendamento, telCliente, nomeCliente, descricao, id, atendimento, onRefresh, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  // Use useEffect para carregar colaboradores e serviços uma vez quando o ID estiver disponível
  useEffect(() => {
    const fetchColaboradores = async () => {
      const codColaboradores = await viewColaboradorAgendamento(id);
      console.log(codColaboradores);
      const colaboradoresList = await codColaboradores.map(cod => viewColaborador(cod.codColaborador));
      setColaboradores(colaboradoresList);
    };

    const fetchServicos = async () => {
      const servicosList = viewServicoAgendamento(id);
      const servicosDetail = await Promise.all(servicosList.map(servico => viewServicoID(servico.codServico)));
      setServicos(servicosDetail);
    };

    fetchColaboradores();
    fetchServicos();
    
  }, [id]);  // Executar este efeito sempre que o `id` mudar

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
  }

  let style = atendimento ? styles.agendamentoConcluido : styles.agendamento;

  if (horaAgendamento < new Date().toLocaleTimeString() && !atendimento) {
    style = styles.agendamentoAtrasado;
  }

  dataAgendamento = dataAgendamento.split('T')[0].split('-').reverse().join('/');
  
  return (
    <View style={style}>
      <Text style={styles.horario}>{horaAgendamento}</Text>
      <View style={styles.servicoCliente}>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            <AntDesign name="user" size={14} color="white" /> Nome: {nomeCliente}
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="phone" size={14} color="white" /> Telefone: {telCliente}
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="date-range" size={14} color="white" /> Data: {dataAgendamento}
          </Text>
          <Text style={styles.infoText}>
            
              <MaterialIcons name="work" size={14} color="white" /> Serviço: {servicos.map((servico, index) => (
                <Text key={index}>
                  {servico?.nome} {index < servicos.length - 1 ? ', ' : ''}
                </Text>
            ))}
              
          </Text>

          <Text style={styles.infoText}>
            <MaterialIcons name="people" size={14} color="white" /> Colaboradores: {colaboradores.map((colaborador, index) => (
              <Text key={index}>
                {colaborador?.nome} {index < colaboradores.length - 1 ? ', ' : ''} 
              </Text>
            ))}
          </Text>

          <Text style={styles.infoText}>
            <MaterialIcons name="description" size={14} color="white" /> Descrição: {descricao}
          </Text>
        </View>
      </View>
      <View style={styles.acoes}>
        <MaterialIcons name="notifications" size={24} color="yellow" />

        {/* Ícone de três pontos com ação */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>

        {/* Modal para mostrar as ações */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Ações</Text>
            {!atendimento ? (
              <Text style={styles.btnConcluir} onPress={() => handleAtendimento(id, 1)}>
                Concluir
              </Text>
            ) : (
              <Text style={styles.btnDesfazer} onPress={() => handleAtendimento(id, 0)}>
                Desfazer
              </Text>
            )}
            <Text style={styles.btnAction} onPress={() => handleEdit(id)}>
              Editar
            </Text>
            <Text style={styles.btnActionDelete} onPress={() => handleDelete(id)}>
              Deletar
            </Text>
            <Text style={styles.btnActionCancel} onPress={() => setModalVisible(false)}>
              Fechar
            </Text>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  agendamento: {
    backgroundColor: '#6D6B69',
    padding: 15,
    height: 180,
    marginBottom: 10,
    borderRadius: 10,
    color: 'white',
  },
  agendamentoConcluido: {
    backgroundColor: '#228B22',
    padding: 15,
    height: 180,
    marginBottom: 10,
    borderRadius: 10,
    color: 'white',
  },
  agendamentoAtrasado: {
    backgroundColor: '#ED213A',
    padding: 15,
    height: 180,
    marginBottom: 10,
    borderRadius: 10,
    color: 'white',
  },
  horario: {
    paddingBottom: 5,
    paddingLeft: 5,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  servicoCliente: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infoText: {
    color: 'white',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: 30,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
  },
  btnAction: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    textAlign: 'center',
    width: '45%',
    color: 'white',
    fontSize: 24,
  },
  btnActionDelete: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ED213A",
    textAlign: 'center',
    width: '45%',
    color: 'white',
    fontSize: 24,
  },
  btnActionCancel: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: 'center',
    width: '45%',
    color: '#6D6B69',
    borderColor: '#6D6B69',
    borderWidth: 1,
    fontSize: 24,
  },
  btnConcluir: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#228B22",
    textAlign: 'center',
    width: '45%',
    color: 'white',
    fontSize: 24,
  },
  btnDesfazer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFD700",
    textAlign: 'center',
    width: '45%',
    color: 'white',
    fontSize: 24,
  }
});
