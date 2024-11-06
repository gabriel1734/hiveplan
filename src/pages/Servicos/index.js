import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Modal, View, TextInput, ScrollView, Alert, RefreshControl } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { addServico, adicionarTipoAgendamento, deleteServico, editarTipoAgendamento, deleteAgendamento, excluirTipoAgendamento, updateServico, verTipoAgendamento, verTipoAgendamentos, viewServicoAll, viewServicoID, updateServicoFavorito } from "../../database";
import Toast from "react-native-root-toast";
import { Checkbox } from "react-native-paper";

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
        <View style={styles.modalView}>
          <View style={styles.buttonContainer}>
            <AntDesign name="arrowleft" size={32} color="black" onPress={() => {navigation.goBack()}}/>
          </View>
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
          <View style={styles.containerFavorito}>
            <Text style={styles.textFavorito} >
              Favorito
            </Text>
            <Checkbox
              status={favorito ? 'checked' : 'unchecked'}
              onPress={() => setFavorito(favorito ? 0 : 1)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.btnActionCancel} onPress={() => handleClear()}>
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
                height: '60%',
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
                        name={servico.favorito == 1 ? 'star' : 'staro'}
                        size={24}
                        color='gold'
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerFavorito: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  textFavorito:{
    fontSize: 16,
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

export default Servicos;
