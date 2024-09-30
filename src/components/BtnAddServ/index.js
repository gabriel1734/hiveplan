import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Modal, View, TextInput, FlatList, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { adicionarTipoAgendamento, verAgendamentos, excluirAgendamento } from "../../database";

const BtnAddServ = ({ refresh, setRefresh }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);

  // Função para carregar todos os agendamentos
  const loadAgendamentos = () => {
    const agendamentos = verAgendamentos(); // Função que busca todos os agendamentos
    setAgendamentos(agendamentos);
  };

  // Carregar os agendamentos ao montar o componente
  useEffect(() => {
    loadAgendamentos();
  }, [refresh]);

  const handleCreateOrEditAgendamento = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    adicionarTipoAgendamento(nome, descricao); // Salva no banco de dados
    setNome(''); // Limpa o campo de nome
    setDescricao(''); // Limpa o campo de descrição
    setModalVisible(false);
    setRefresh(!refresh); // Atualiza a lista após salvar
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Agendamento",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
            excluirAgendamento(id); // Exclui do banco de dados
            setRefresh(!refresh); // Atualiza a lista após exclusão
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.agendamentoItem}>
      <Text style={styles.agendamentoText}>Nome: {item.nomeCliente}</Text>
      <Text style={styles.agendamentoText}>Descrição: {item.descricao}</Text>
      <Text style={styles.agendamentoText}>Data: {item.dataAgendamento}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Nenhum agendamento encontrado.</Text>}
        ListHeaderComponent={
          <>
            <TouchableOpacity style={styles.button} onPress={handleCreateOrEditAgendamento}>
              <Text style={styles.buttonText}>
                <AntDesign style={styles.text} name="plussquare" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Lista de Agendamentos</Text>
          </>
        }
        contentContainerStyle={{ paddingBottom: 100 }} // Espaço extra ao final da lista
      />

      {/* Modal para adicionar o tipo de serviço */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Adicionar Tipo de Serviço</Text>
          <TextInput
            placeholder="Nome do Serviço"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            placeholder="Descrição"
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
          />
          <View style={styles.buttonContainer}>
            <Text style={styles.btnActionCancel} onPress={() => setModalVisible(false)}>
              Cancelar
            </Text>
            <Text style={styles.btnActionSave} onPress={handleSave}>
              Salvar
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnActionSave: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    textAlign: 'center',
    width: '45%',
    color: 'white',
  },
  btnActionCancel: {
    color: '#6D6B69',
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: 'center',
    width: '45%',
    borderColor: '#6D6B69',
    borderWidth: 2,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: '100%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  agendamentoItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  agendamentoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BtnAddServ;
