import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, StyleSheet, Text, TextInput, View, SafeAreaView, useColorScheme, Alert, BackHandler } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';
import { addServicoRamo, adicionarDadosEmpresa, backupDatabase, dropTables, resetDatabase, updateDadosEmpresa, viewEmpresa } from "../../database";
import styled from "styled-components";
import Toast from 'react-native-root-toast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import light from "../../theme/light";
import dark from "../../theme/dark";
import { DataTheme } from "../../context";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';


export default function Configuracao({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [logo, setLogo] = useState('');
  const [ramoAtividade, setRamoAtividade] = useState('');
  const [ramoChange, setRamoChange] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState('');
  const { theme, setTheme } = useContext(DataTheme);
  const { msg } = route.params || '';
  const [selectedTheme, setSelectedTheme] = useState();
  const systemTheme = useColorScheme();
  const [textMSG, setTextMSG] = useState('');

const handleThemeChange = async (themeOption) => {
  try {
    setSelectedTheme(themeOption); // Atualiza o tema selecionado no estado
    console.log("Tema selecionado:", themeOption);

    if (themeOption === "default") {
      // Determina o tema com base nas configurações do dispositivo
      const deviceTheme = useColorScheme();
      console.log("Tema do dispositivo:", deviceTheme);

      if (deviceTheme === "dark") {
        setTheme(dark);
      } else {
        setTheme(light);
      }

      // Remove o tema armazenado para usar o padrão do dispositivo
      await AsyncStorage.removeItem("theme");
    } else if (themeOption === "light") {
      // Define o tema claro e armazena a escolha
      setTheme(light);
      await AsyncStorage.setItem("theme", "light");
    } else if (themeOption === "dark") {
      // Define o tema escuro e armazena a escolha
      setTheme(dark);
      await AsyncStorage.setItem("theme", "dark");
    }
  } catch (error) {
    console.error("Erro ao alterar o tema:", error);
  }
};


  const handleAtividadeChange = (atividade) => {
    if (atividade !== ramoAtividade) {
      setRamoAtividade(atividade);
      setRamoChange(true); // Apenas marca como alterado se o ramo realmente mudar
    }
  };

  const handleGet = async () => {
    const dadosEmpresa = viewEmpresa();
    if(dadosEmpresa){
      setNome(dadosEmpresa.nomeEmpresa);
      setTelefone(dadosEmpresa.telefoneEmpresa);
      setEndereco(dadosEmpresa.enderecoEmpresa);
      setRamoAtividade(dadosEmpresa.ramoEmpresa);
      setIdEmpresa(dadosEmpresa.id);
      setTextMSG(dadosEmpresa.msgConfiguracao);
    } else {
      setTextMSG(`
          Olá [nomeCliente]. Você possui agendado o serviço [Serviço] às [Hora] do dia [Data] na [Empresa].
        `);
    }
    const savedTheme = await AsyncStorage.getItem('theme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      setThemeOption(savedTheme);
    } else {
      const device = useColorScheme();
      console.log('device', device);  
      if (device === 'dark') {
        setSelectedTheme('dark');
      } else {
        setSelectedTheme('light');
      }
      setThemeOption('default');
    }
    const uri = await AsyncStorage.getItem('logo');
    if (uri) {
      setLogo(uri);
    }
    setRamoChange(false);
  }

  useEffect(() => {
    handleGet();
    if(msg){
      Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        backgroundColor: '#00FF00',
      });
    }
    setRamoChange(false);
  },[])

 const handleSave = () => {
  // Verifica se os campos obrigatórios estão preenchidos
  if (nome === '' || nome == null) {
    Toast.show('Preencha o campo Nome', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#FF0000',
    });
    return;
  }
  if (telefone === '' || telefone == null) {
    Toast.show('Preencha o campo Telefone', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#FF0000',
    });
    return;
  }

  if (idEmpresa) {
    // Atualiza os dados da empresa
    if (updateDadosEmpresa(idEmpresa, nome, telefone, endereco, logo, ramoAtividade, textMSG)) {
      if (ramoChange) {
        addServicoRamo(ramoAtividade); // Adiciona serviços apenas se houve alteração no ramo
      }
      Toast.show('Atualizado!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#00FF00',
      });
      navigation.navigate('Home');
    } else {
      Toast.show('Erro ao atualizar!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
    }
  } else {
    // Adiciona nova empresa
    if (adicionarDadosEmpresa(nome, telefone, endereco, logo, ramoAtividade, textMSG)) {
      if (ramoChange) {
        addServicoRamo(ramoAtividade); // Adiciona serviços apenas se houve alteração no ramo
      }
      Toast.show('Adicionado!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#00FF00',
      });

      setIdEmpresa(viewEmpresa().id);
    } else {
      Toast.show('Erro ao adicionar!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
    }
  }

  // Reseta o estado de alteração de ramo
  setRamoChange(false);
};


  const pickImage = async () => {
  try {
    // Solicita permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show('Erro! É necessário fornecer a permissão para utilizar o logo', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
      return;
    }

    // Abre a galeria para selecionar a imagem
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
      await saveLogo(result.assets[0].uri);
    }
  } catch (error) {
    console.log("Erro ao selecionar a imagem: ", error);
    Toast.show("Erro ao selecionar a imagem", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: "#FF0000",
    });
  }
};

  const saveLogo = async (uri) => {
    try {
      await AsyncStorage.setItem('logo', uri);
    } catch (error) {
      console.log('Erro ao salvar o logo: ', error);
    }
  };

  // Função para carregar o logo salvo no AsyncStorage
  const loadLogo = async () => {
    try {
      const uri = await AsyncStorage.getItem('appLogo');
      if (uri) {
        setLogo(uri);
      }
    } catch (error) {
      console.log('Erro ao carregar o logo: ', error);
    }
  };
  const handleDelete = async () => {
    try {
      await AsyncStorage.removeItem('logo');
      setLogo('');
      Toast.show('Logo removido!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#00FF00',
      });
    } catch (error) {
      console.log('Erro ao remover o logo: ', error);
      Toast.show('Erro ao remover o logo!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
    }
  }


  const handleBackup =  () => {
    backupDatabase();
    console.log('Implementar backup');
  }

  const ConfirmReset = () => {
    Alert.alert(
      'Reset',
      'Deseja realmente resetar o aplicativo? Isso apagará todos os dados e todas a configurações salvas para sempre!',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Sim', onPress: () => handleReset() },
      ],
      { cancelable: false }
    );
  }

  const handleReset = async () => {
    const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();
    const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (!isBiometricSupported && supported.length === 0) {
      Alert.alert('Seu dispositivo não autenticação biométrica');
    }

    const savedBiometric = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometric) {
      Alert.alert('Digite sua senha para continuar');
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para continuar',
      cancelLabel: 'Usar PIN/Senha',
      fallbackLabel: 'Digite seu PIN/Senha',
    });

    if (biometricAuth.success) {
      await AsyncStorage.clear();
      resetDatabase();
      Toast.show('Aplicativo resetado!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#00FF00',
      });
      BackHandler.exitApp();
    } else {
      Toast.show('Autenticação falhou!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#FF0000',
      });
    }

  }

  // Carrega o logo quando o componente monta
  useEffect(() => {
    loadLogo();
  }, [])

  

  const backgroundColor = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];

  
  return (
    <Page>
      <LinearGradient colors={backgroundColor} style={styles.containerHeader}>
        <AntDesign name="arrowleft" size={24} color="black" onPress={() => navigation.goBack()} />
        <Title>Configuração</Title>
      </LinearGradient>
      <Container>
        <Content>
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
          <View style={{ alignItems: 'center', justifyContent: 'center', padding:20, height: 300}}>
            <Image
              source={logo ? { uri: logo }: theme === light ? require('../../../assets/img/HIVEPLAN.png') :  require('../../../assets/img/HIVEPLAN-WHITE.png') }
              style={{ width: 200, height: 200, borderRadius: 10}}
            />
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems:'center', justifyContent: 'center', width: '100%', gap:10}}>
              <TouchableOpacity onPress={pickImage}>
                <ThemeSelect>
                  <ThemeBtn>Alternar Logo</ThemeBtn>
                </ThemeSelect>
              </TouchableOpacity>
              <ExcludeButton onPress={() => handleDelete()}><AntDesign name="delete" size={24} color="black" /></ExcludeButton>
            </View>
            
        </View>
          
          <Label style={{marginTop: 30}}>Selecione a Atividade:</Label>
          <RNPickerSelect
            style={{
              inputIOS: {
                color: theme.text, // Cor do texto
                backgroundColor: theme.inputBackground, // Fundo
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: theme.borderColor,
                borderRadius: 5,
                marginTop: 10,
                marginBottom: 10,
              },
              inputAndroid: {
                color: theme.text, // Cor do texto
                backgroundColor: theme.inputBackground, // Fundo
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: theme.borderColor,
                borderRadius: 5,
                marginTop: 10,
                marginBottom: 10,
              },
              placeholder: {
                color: theme.placeholder || '#888', // Cor do placeholder, com fallback
              },
            }}
            placeholderTextColor={theme.text}
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
          <Label>Selecione o Tema:</Label>
          <RadioGroup>
            <RadioOption onPress={() => handleThemeChange("light")}>
              <RadioCircle>
                {selectedTheme === "light" && <RadioCircleSelected />}
              </RadioCircle>
              <RadioLabel>Claro</RadioLabel>
            </RadioOption>

            <RadioOption onPress={() => handleThemeChange("dark")}>
              <RadioCircle>
                {selectedTheme === "dark" && <RadioCircleSelected />}
              </RadioCircle>
              <RadioLabel>Escuro</RadioLabel>
            </RadioOption>
            <RadioOption onPress={() => handleThemeChange("default")}>
              <RadioCircle>
                {selectedTheme === "default" && <RadioCircleSelected />}
              </RadioCircle>
              <RadioLabel>Automático</RadioLabel>
            </RadioOption>
          </RadioGroup>
          <Label>Defina uma Mensagem Padrão</Label>
          <StyledTextInput placeholder="Mensagem Padrão" placeholderTextColor="#888" multiline={true} numberOfLines={4} value={textMSG} onChangeText={setTextMSG} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <BtnBackup style={styles.saveButton} onPress={handleBackup}>
              <AntDesign name="cloudupload" size={24} color="black" />
              <BtnBackupText>Backup</BtnBackupText>
            </BtnBackup>
            <BtnReset style={styles.saveButton} onPress={ConfirmReset}>
              <AntDesign name="delete" size={24} color="black" />
              <BtnResetText>Reset</BtnResetText>
            </BtnReset>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient colors={backgroundColor} style={styles.saveButtonGradient}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Content>
      </Container>
      <Toast />
    </Page>
  );
}

const Page = styled.View`
 flex:1;
  background-color: ${props => props.theme.background};
`;

const Container = styled.ScrollView`
  flex: 1; /* Para ocupar todo o espaço disponível */
  padding: 24px;
  padding-bottom: 50px;
`;

const ExcludeButton = styled.Text`
  background-color: ${props => props.theme.secondary};
  padding: 10px;
  border-radius: 5px;
  color: ${props => props.theme.buttonText};
`;

const BtnBackup = styled.TouchableOpacity`
  background-color: ${props => props.theme.buttonBackground};
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;
  width: 48%;
  text-align: center;
  color: ${props => props.theme.buttonText};
`;

const BtnBackupText = styled.Text`
  color: ${props => props.theme.buttonText};
  margin-left: 10px;
`

const BtnReset = styled.TouchableOpacity`
  background-color: ${props => props.theme.secondary};
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;
  width: 48%;
  text-align: center;
  color: ${props => props.theme.buttonText};
  `;
  
const BtnResetText = styled.Text`
  color: ${props => props.theme.buttonText};
  margin-left: 10px;
`;

const Content = styled.SafeAreaView`
  margin-bottom: 50px;
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

const StyledTextInput = styled.TextInput`
  border-Color: ${props => props.theme.borderColor};
  border-Width: 1px;
  border-Radius: 5px;
  background-Color: ${props => props.theme.inputBackground};
  padding: 10px;
  margin-Bottom: 10px;
  color: ${props => props.theme.text};
`

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
const ThemeSelect = styled.View`
  border-color: ${props => props.theme.borderColor};
  background-color: ${props => props.theme.inputBackground};
  border-radius: 10px;
  width: '100%';
  height: '100%';
`
const ThemeBtn = styled.Text`
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => props.theme.buttonBackground};
  text-align: center;
  width: '100%';
  color: ${props => props.theme.buttonText};
`
const RadioGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const RadioOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const RadioCircle = styled.View`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => props.theme.borderColor || "#888"};
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

const RadioCircleSelected = styled.View`
  height: 12px;
  width: 12px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.buttonBackground || "#007BFF"};
`;

const RadioLabel = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

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
    marginTop: 20,
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
