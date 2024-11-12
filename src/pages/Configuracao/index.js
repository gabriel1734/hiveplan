import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, TextInput, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';
import { addServicoRamo, adicionarDadosEmpresa, updateDadosEmpresa, viewEmpresa } from "../../database";
import styled from "styled-components";
import Toast from 'react-native-root-toast';


export default function Configuracao({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [logo, setLogo] = useState('');
  const [ramoAtividade, setRamoAtividade] = useState('');
  const [ramoChange, setRamoChange] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState('');

  const handleAtividadeChange = (atividade) => {
    setRamoAtividade(atividade);
    setRamoChange(true);
  };

  handleGet = () => {
    const dadosEmpresa = viewEmpresa();
    if(dadosEmpresa){
      setNome(dadosEmpresa.nomeEmpresa);
      setTelefone(dadosEmpresa.telefoneEmpresa);
      setEndereco(dadosEmpresa.enderecoEmpresa);
      setLogo(dadosEmpresa.logo);
      setRamoAtividade(dadosEmpresa.ramoEmpresa);
      setIdEmpresa(dadosEmpresa.id);
    }
  }

  useEffect(() => {
    handleGet();
  },[])

  const handleSave = () => {
    if (nome == '' || nome == null) {
      Toast.show('Preencha o campo Nome', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }
    if (telefone == '' || telefone == null) {
      Toast.show('Preencha o campo Telefone', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }
    
    if (idEmpresa) {
      if (updateDadosEmpresa(idEmpresa, nome, telefone, endereco, logo, ramoAtividade)) {
        if (ramoChange) {
          addServicoRamo(ramoAtividade);
        }
        Toast.show('Atualizado!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#00FF00',
        });
      }
        
      else {
        Toast.show('Erro!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#FF0000',
        });
      }
    } else {
      if (adicionarDadosEmpresa(nome, telefone, endereco, logo, ramoAtividade)) {
        if (ramoAtividade) {
          addServicoRamo(ramoAtividade);
        }
        Toast.show('Adicionado!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#00FF00',
        });
        
      } else {
        Toast.show('Erro!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#FF0000',
        });
      }

    }
  }
  
  return (
    <Page>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.containerHeader}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
        <Title>Configuração</Title>
      </LinearGradient>
      <Container>
        <StyledInput value={nome} placeholder="Nome"  placeholderTextColor="#888" onChangeText={setNome} />
        <StyledTextInputMask
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          value={telefone}
          onChangeText={setTelefone}
          placeholderTextColor="#888"
          placeholder="Telefone"
          keyboardType="phone-pad"
        />
        <StyledInput value={endereco} placeholder="Endereço"  placeholderTextColor="#888" onChangeText={setEndereco} />
        <StyledInput value={logo} placeholder="Logo"  placeholderTextColor="#888" onChangeText={setLogo} />
        
        <Label>Selecione a Atividade:</Label>
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholderTextColor="#888"
          onValueChange={handleAtividadeChange}
          items={[
            { label: "Restaurante", value: "restaurante" },
            { label: "Salão de Beleza", value: "salaoDeBeleza" },
            { label: "Oficina Mecânica", value: "oficinaMecanica" },
            { label: "Academia", value: "academia" },
            { label: "Pet Shop", value: "petShop" },
          ]}
          value={ramoAtividade}
          placeholder={{ label: "Escolha uma atividade...", value: "" }}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.saveButtonGradient}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Container>
      <Toast />
    </Page>
  );
}

const Page = styled.View`
 flex:1;
  background-color: ${props => props.theme.background};
`;

const Container = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size:24px;
  font-weight: bold;
`;

const StyledInput = styled.TextInput`
  height: 50px;
  border-Color: ${props => props.theme.borderColor};
  border-Width: 1px;
  border-Radius: 5px;
  background-Color: ${props => props.theme.inputBackground};
  padding: 10px;
  margin-Bottom: 10px;
  color: ${props => props.theme.text};
`;

const StyledTextInputMask = styled(TextInputMask)`
  height: 50px;
  border-Color: ${props => props.theme.borderColor};
  border-Width: 1px;
  border-Radius: 5px;
  background-Color: ${props => props.theme.inputBackground};
  padding: 10px;
  margin-Bottom: 10px;
  color: ${props => props.theme.text};
`;

const Label = styled.Text`
  padding-top:10px;
  font-Size: 18px;
  font-Weight: bold;
  color: ${props => props.theme.text};
`

const StyledPickerSelect = styled(RNPickerSelect)`
  font-Size: 16px;
  border-Width: 1px;
  border-Color: ${props => props.theme.borderColor};
  background-Color: ${props => props.theme.inputBackground};
  border-Radius: 5px;
  color: ${props => props.theme.text};
  padding-Right: 30px;
`

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
