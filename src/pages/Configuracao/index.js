import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, TextInput, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';
import { addServicoRamo, adicionarDadosEmpresa } from "../../database";

export default function Configuracao({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [logo, setLogo] = useState('');
  const [ramoAtividade, setRamoAtividade] = useState('');

  const handleAtividadeChange = (atividade) => {
    setRamoAtividade(atividade);
  };

  const handleSave = () => {
    
   const dadosEmpresa = adicionarDadosEmpresa(nome,telefone,endereco,logo,ramoAtividade);
   console.log(dadosEmpresa);

    if(dadosEmpresa){
      try{
        const servicos =  addServicoRamo(ramoAtividade);
        if(servicos) navigation.navigate("Home");
        else {
          console.log("erro serviço", servicos);
          return false;
        }
      }
      catch(e){
        console.log("erro ao adicionar serviços", e);
      }
    }
    else{
      console.log("erro ao inseir dados de empresa e serviços!");
    }
    console.log({
      nome,
      telefone,
      endereco,
      logo,
      ramoAtividade,
    });
  }
  
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.containerHeader}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Configuração</Text>
      </LinearGradient>
      <View style={styles.container}>
        <TextInput value={nome} placeholder="Nome" style={styles.input} onChangeText={setNome} />
        <TextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Telefone"
          keyboardType="phone-pad"
        />
        <TextInput value={endereco} placeholder="Endereço" style={styles.input} onChangeText={setEndereco} />
        <TextInput value={logo} placeholder="Logo" style={styles.input} onChangeText={setLogo} />
        
        <Text style={styles.label}>Selecione a Atividade:</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={handleAtividadeChange}
          items={[
            { label: "Restaurante", value: "restaurante" },
            { label: "Salão de Beleza", value: "salaoDeBeleza" },
            { label: "Oficina Mecânica", value: "oficinaMecanica" },
            { label: "Academia", value: "academia" },
            { label: "Pet Shop", value: "petShop" },
          ]}
          placeholder={{ label: "Escolha uma atividade...", value: "" }}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.saveButtonGradient}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 60,
    height: 50,
  },
  saveButtonGradient: {
    borderRadius: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
  },
});
