import { SafeAreaView,CheckBox } from "react-native";
import { View,useState,useEffect } from "react";
import { TextInput } from "react-native-web";
import { verTipoAgendamentos } from "../../database";

export default Colaboradores = ({navigation}) => {

    const [tiposAgendamentos, setTiposAgendamentos] = useState([]);
    const [isSelected, setSelection] = useState(false);



 const loadAgendamentos = () => {
    setTiposAgendamentos(verTipoAgendamentos());
  };

  useEffect(() => {
    loadAgendamentos();
  },)*/


    return(
        <View>
            
            <View>
                <Text>Nome do colaborador:</Text>
                <TextInput   placeholder="Nome do colaborador"/>
            </View>
            {/*tiposAgendamentos.map((agendamento) => (
                <View key={agendamento.id} style={styles.agendamentoItem}>
                  <Text style={styles.agendamentoText}>{agendamento.nomeTipo}</Text>
                  <Text style={styles.agendamentoText}>{agendamento.descricao}</Text>
                </View>
              ))*/} 
        </View>
    );
}

