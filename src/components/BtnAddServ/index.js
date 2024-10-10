import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Modal, View, TextInput, ScrollView, Alert, RefreshControl } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { addServico, adicionarTipoAgendamento, deleteServico, editarTipoAgendamento, deleteAgendamento, excluirTipoAgendamento, updateServico, verTipoAgendamento, verTipoAgendamentos, viewServicoAll, viewServicoID, updateServicoFavorito } from "../../database";
import Toast from "react-native-root-toast";

const BtnAddServ = ({ refresh, setRefresh }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [id, setId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tiposAgendamentos, setTiposAgendamentos] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [favoritos, setFavoritos] = useState({});


  const handleToggleFavorito = (id) => {
    setFavoritos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    updateServicoFavorito(id, favoritos[id] ? false : true);
  };

  // Função para carregar todos os agendamentos
  const loadAgendamentos = () => {
    setTiposAgendamentos(viewServicoAll());
  };

  // Carregar os agendamentos ao montar o componente
  useEffect(() => {
    loadAgendamentos();
  }, [refresh]);

  const handleCreateOrEditAgendamento = () => {
    setModalVisible(true);
  };

  const handleSave = () => {

    if (id) {
      if(updateServico(id,nome,descricao,false))
        Toast.show("Atualizado!")
      else
      Toast.show("Erro!");
    } else {
      if(addServico(nome, descricao))
        Toast.show("Adicionado!");
      else 
      Toast.show("Erro!");

    }
    
    setNome(''); 
    setDescricao('');
    setId('');
    setModalVisible(false);
    setRefresh(!refresh); 
  };

  const handleEdit = (id) => {
    const r = viewServicoID(id)
    setId(r.id);
    setNome(r.nome);
    setDescricao(r.descricao);
  }

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Agendamento",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
           if(deleteServico(id))
            Toast.show("Exluido com sucesso!") // Exclui do banco de dados
            console.log('Excluiu');
            setRefresh(!refresh); 
            onRefresh();
          }
        }
      ]
    );
  };

  const onRefresh = () => {
  setRefreshList(true);
  setTimeout(() => {
    loadAgendamentos();
    setRefreshList(false);
  }, 1000);
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCreateOrEditAgendamento}>
        <Text style={styles.buttonText}>
          <AntDesign style={styles.text} name="plussquare" size={24} color="white" />
        </Text>
      </TouchableOpacity>

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
          <Text
            placeholder="ID"
            style={{ display: 'none' }}
            value={id}
          />
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
          <View style={styles.actionContainer}>
            <ScrollView
              style={{
                width: '100%',
                height: '80%',
              }}
              refreshControl={
              <RefreshControl refreshing={refreshList} onRefresh={onRefresh} />
              }
            >
              {tiposAgendamentos.map((servico) => (
                <View key={servico.id} style={styles.agendamentoItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.agendamentoText}>{servico.nome}</Text>
                    <TouchableOpacity onPress={() => handleToggleFavorito(servico.id)}>
                      <AntDesign
                        name={favoritos[servico.id] ? 'star' : 'staro'}
                        size={24}
                        color={favoritos[servico.id] ? 'gold' : 'gray'}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.agendamentoText}>{servico.descricao}</Text>
                  <View style={styles.actionButtons}>
                    <Text style={styles.editButton} onPress={() => handleEdit(servico.id)}>Editar</Text>
                    <Text style={styles.deleteButton} onPress={() => handleDelete(servico.id)}>Excluir</Text>
                  </View>
                </View>
              ))}
          </ScrollView>
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
  actionContainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
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
    backgroundColor: '#6D6B69',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  agendamentoText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    color: '#6D6B69',

  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BtnAddServ;
