import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button, Alert } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { excluirAgendamento, verTipoAgendamento } from "../../database";

export default Agendamento = ({ horaInicioAgendamento, horaFimAgendamento, nomeCliente, descricao, tipoAgendamento, id, onRefresh, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const nomeTipoAgedamento = verTipoAgendamento(tipoAgendamento);

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Agendamento",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
            excluirAgendamento(id);
            
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
      <Text style={styles.horario}>{horaInicioAgendamento} - {horaFimAgendamento}</Text>
      <View style={styles.servicoCliente}>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            <AntDesign name="user" size={14} color="white" /> Nome: {nomeCliente}
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="description" size={14} color="white" /> Descrição: {descricao}
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="work" size={14} color="white" /> Serviço: {nomeTipoAgedamento.nomeTipo}
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
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
    color: 'white',
  },
  horario: {
    paddingBottom: 5,
    paddingLeft: 5,
    fontWeight: 'bold',
    fontSize: 16,
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
