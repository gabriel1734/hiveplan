import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button, Alert } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { deleteAgendamento, viewAgendamentoID, viewColaborador, viewColaboradorAgendamento, viewServicoAgendamento, viewServicoID,} from "../../database";
import Toast from "react-native-root-toast";

export default Agendamento = ({horaAgendamento,dataAgendamento,telCliente, nomeCliente, descricao, atendimento, id, onRefresh, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [servicos, setServicos] = useState([]);
  
  const codColaboradores = viewColaboradorAgendamento(id);

  const [colaboradores, setColaboradores] = useState([]);

  codColaboradores.forEach((cod) => {
    setColaboradores([...colaboradores, viewColaborador(cod)]);
  })

  const codServicos = viewServicoAgendamento(id);

  codServicos.forEach((cod) => { 
    setServicos([...servicos, viewServicoID(cod)]);
  });

  console.log(colaboradores);

  //ATENÇÃO!

  // Eu estava tentando atualizar as informações dos cards de acordo com as novas tabelas mas,
  // acabei enfrentando o problema de que o agendamento pode ter mais de um colaborador/serviço
  // e eu não sei como renderizar isso em react-native então vou deixar com vocês essa parte;

  // Obs.: Deem uma olhada nas constantes que eu utilizei pra pegar os dados do agendamento,
  // eu acho que desse jeito é melhor do que passar todos os dados igual estamos fazendo na linha 7


  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Agendamento",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
            if(deleteAgendamento(id)){
              Toast.show("Deletado com sucesso!")
            }
            
            onRefresh();
          }
        }
      ]
    );
  };

  const handleEdit = (id) => {
    setModalVisible(false);
    navigation.navigate('Agendamento', { id });
  }

  return (
    <View style={styles.agendamento}>
      <Text style={styles.horario}>{horaAgendamento}</Text>
      <View style={styles.servicoCliente}>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            <AntDesign name="user" size={14} color="white" /> Nome: {nomeCliente}
          </Text>
          <Text style={styles.infoText}>
            Telefone: {telCliente}
           </Text>
           <Text style={styles.infoText}>Data: {dataAgendamento}</Text>
          <Text style={styles.infoText}>
            {colaboradores.map((colaborador, index) => (
              <Text key={index}>
                <MaterialIcons name="person" size={14} color="white" /> Colaborador: {colaborador.nome}
              </Text>
            ))}
           </Text>
           
          <Text style={styles.infoText}>
            <MaterialIcons name="description" size={14} color="white" /> Descrição: {descricao}
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="work" size={14} color="white" /> Serviço: {servicos.map((servico, index) => (
              <Text key={index}>{servico.nome}</Text>
            ))}
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
            <Text style={styles.btnAction} onPress={() =>  handleEdit(id)}>
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
    height: 160,
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
  }
});
