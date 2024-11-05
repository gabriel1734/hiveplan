import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import RNPickerSelect from 'react-native-picker-select';


export default function Estabelecimento({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [logo, setLogo] = useState('');
  const [ramoAtividade, setRamoAtividade] = useState('');

  const handleSave = () => {
    console.log({
      nome,
      telefone,
      endereco,
      logo,
      ramoAtividade,
    });
  }
  
  return (
    <View>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.containerHeader}>
        <Text style={styles.title}>Estabelecimento</Text>
      </LinearGradient>
      <View style={styles.container}>
        <TextInput value={nome} placeholder="Nome" style={styles.input} onChangeText={setNome} />
        <TextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          style={styles.input}
          value={telefone}
          onChangeText={(text) => setTelefone(text)}
          placeholder="Telefone"
          keyboardType="phone-pad"
        />
        <TextInput value={endereco} placeholder="Endereço" style={styles.input} onChangeText={setEndereco} />
        <TextInput value={logo} placeholder="Logo" style={styles.input} onChangeText={setLogo} />
        <RNPickerSelect
          style={styles.inputSelect}
          placeholder={{ label: 'Selecione o ramo de atividade', value: null }}
          onValueChange={(value) => setRamoAtividade(value)}
          items={[
            { label: 'Salão de beleza', value: 'salao' },
            { label: 'Barbearia', value: 'barbearia' },
            { label: 'Estética', value: 'estetica' },
            { label: 'Mecânica', value: 'mecanica' },
          ]}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.saveButtonGradient}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
      
    </View>
   
  )
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
    backgroundColor: '#6D6B69',
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
  inputSelect: {
      inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
      borderRadius: 5
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: 'white',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
      borderRadius: 5
    },
  },
  saveButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 60,
    height: 50,
  },
  saveButtonGradient:{
    borderRadius: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    
  }
})