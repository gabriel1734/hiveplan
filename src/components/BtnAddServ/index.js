import React, { useState, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, Modal, View, TextInput, Button } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { adicionarTipoAgendamento } from "../../database";


const BtnAddServ = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleCreateOrEditAgendamento = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    // Chama a função do banco de dados para adicionar o novo tipo de agendamento
    if (nome && descricao) {
      //adicionarTipoAgendamento(nome, descricao);
      setModalVisible(false);
      setNome(''); // Limpa o campo de nome
      setDescricao(''); // Limpa o campo de descrição
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View>
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
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            <Button title="Salvar" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default BtnAddServ;
