import { SafeAreaView, View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper'; // Importação do Checkbox do react-native-paper
import { viewServicoAll, viewColaboradorAll, updateColaborador, addColaborador, viewColaborador, addAgendamentoColaborador, addServicoColaborador, viewServicoColaborador } from "../../database";
import Toast from "react-native-root-toast";

export default function Colaboradores({ navigation }) {

  const [tiposAgendamentos, setTiposAgendamentos] = useState([]);
  const [selectedAgendamentos, setSelectedAgendamentos] = useState({});
  const [favoriteAgendamentos, setFavoriteAgendamentos] = useState({});
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
  }

  useEffect(() => {
    loadAgendamentos();
    loadColaboradores();
  }, [refresh]);


  const handleCheckboxChange = (id) => {
    setSelectedAgendamentos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    
  };

  const handleStarPress = (id) => {
    setFavoriteAgendamentos(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSave = () => {

    if (!nome) {
      Alert.alert('Nome do colaborador é obrigatório!');
      return;
    }

    if (Object.keys(selectedAgendamentos).length == 0) {
      Alert.alert('Selecione pelo menos um serviço!');
      return;
    }

    if (id) {
      if(updateColaborador(id,nome)){
        Toast.show("Atualizado!")
      }
      else
      Toast.show("Erro!");
    } else {
      
      const idColaborador = addColaborador(nome);
      if(idColaborador){
        Object.keys(selectedAgendamentos).forEach((sevicoId) => {
          if(addServicoColaborador(idColaborador, sevicoId, setFavoriteAgendamentos[sevicoId])){
            Alert.alert("Adicionado com sucesso!");
          }
        });
        Toast.show("Adicionado!");
      }
       
      else 
      Toast.show("Erro!");

    }
    setNome(''); 
    setId('');
    setFavoriteAgendamentos({});
    setSelectedAgendamentos({});
    setRefresh(!refresh);
  };

  const handleEdit = (id) => {
    const r = viewColaborador(id)
    const rServicos = viewServicoColaborador(id);
    rServicos.forEach((servico) => {
      setSelectedAgendamentos(prevState => ({
        ...prevState,
        [servico.codServico]: true,
      }));
      setFavoriteAgendamentos(prevState => ({
        ...prevState,
        [servico.id]: servico.favorito == 1 ? true : false,
      }));
    });
    console.log(rServicos);
    setId(r.id);
    setNome(r.nome);
    console.log(selectedAgendamentos)
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
      loadColaboradores();
      setRefreshList(false);
    }, 1000);
    };


  return (
    <>
    <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
      <AntDesign name="arrowleft" size={24} color="black" onPress={() =>{navigation.navigate('Agendamento')}} />
    </LinearGradient>
    <SafeAreaView style={styles.container} refreshControl={
              <RefreshControl refreshing={refreshList} onRefresh={onRefresh} />
              }>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome do colaborador:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nome do colaborador" 
          placeholderTextColor="#888"
          value = {nome}
          onChangeText={setNome}
        />
      </View>
      <Text style={styles.label}>Serviços do Colaborador:</Text>
      <ScrollView style={styles.scrollArea}>
        {tiposAgendamentos.map((agendamento) => (
          <View key={agendamento.id} style={styles.agendamentoItem}>
            <Checkbox
              status={!!selectedAgendamentos[agendamento.id] ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange(agendamento.id)}
            />
            <Text style={styles.agendamentoText}>{agendamento.nome}</Text>
            <TouchableOpacity style={styles.star} onPress={() => handleStarPress(agendamento.id)}>
              <AntDesign
                name="star"
                size={24}
                color={favoriteAgendamentos[agendamento.id] ? 'yellow' : 'black'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
            <Text style={styles.btnActionCancel} onPress={() =>{navigation.navigate('Agendamento')}}>
              Cancelar
            </Text>
            <Text style={styles.btnActionSave} onPress={handleSave}>
              Salvar
            </Text>
      </View>
      <Text style={styles.label}>Colaboradores cadastrados:</Text>      
      <ScrollView style={styles.scrollArea}>
        {colaboradores.map((colaborador) => (
          <View key={colaborador.id} style={styles.agendamentoItem}>
            <Text style={styles.agendamentoText}>{colaborador.nome}</Text>
            <View style={styles.actionButtons}>
              <Text style={styles.editButton} onPress={() => handleEdit(colaborador.id)}>Editar</Text>
              <Text style={styles.deleteButton} onPress={() => handleDelete(colaborador.id)}>Excluir</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Cor de fundo suave
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  scrollArea: {
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    maxHeight: 200,
  },
  agendamentoItem: {
    flexDirection: 'row', // Para alinhar o checkbox e texto em linha
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  agendamentoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10, 
  },
  header: {
    padding: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
  },
  star: {
    padding: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
  },
});
