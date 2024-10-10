import { SafeAreaView, View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper'; // Importação do Checkbox do react-native-paper
import { viewServicoAll } from "../../database";

export default function Colaboradores({ navigation }) {

  const [tiposAgendamentos, setTiposAgendamentos] = useState([]);
  const [selectedAgendamentos, setSelectedAgendamentos] = useState({});
  const [favoriteAgendamentos, setFavoriteAgendamentos] = useState({});

  const loadAgendamentos = () => {
    setTiposAgendamentos(viewServicoAll());
  };

  useEffect(() => {
    loadAgendamentos();
  }, []);

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

  return (
    <>
    <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
      <AntDesign name="arrowleft" size={24} color="black" onPress={() =>{navigation.navigate('Agendamento')}} />
    </LinearGradient>
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome do colaborador:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nome do colaborador" 
          placeholderTextColor="#888"
        />
      </View>
      <Text style={styles.label}>Serviços:</Text>
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
    maxHeight:10,
    backgroundColor: 'red',
    height:50,
  },
  agendamentoItem: {
    flexDirection: 'row', // Para alinhar o checkbox e texto em linha
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
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
    color: '#333',
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
  }
});
