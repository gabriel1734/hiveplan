import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { verTipoAgendamento } from "../../database";

export default Agendamento = ({ horaAgendamento, nomeCliente, descricao, tipoAgendamento }) => {

  const nomeTipoAgedamento = verTipoAgendamento(tipoAgendamento);


  return (
    <View style={styles.agendamento}>
      <Text style={styles.horario}>{horaAgendamento}</Text>
      <View style={styles.servicoCliente}>
        <View style={styles.info}>
          <Text style={styles.infoText}><AntDesign name="user" size={14} color="white" /> Nome: {nomeCliente}</Text>
          <Text style={styles.infoText}><MaterialIcons name="description" size={14} color="white" /> Descrição: {descricao}</Text>
          <Text style={styles.infoText}><MaterialIcons name="work" size={14} color="white" /> Serviço: {nomeTipoAgedamento.nomeTipo}</Text>
        </View>
      </View>
      <View style={styles.acoes}>
        <MaterialIcons name="notifications" size={24} color="yellow" />
        <MaterialIcons name="more-vert" size={24} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  agendamento: {
    backgroundColor: '#6D6B69',
    padding: 15,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
    color: 'white',
  },
  horario: {
    fontWeight: 'bold',
    color: 'white',
  },
  servicoCliente: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infoText: {
    
    color: 'white',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: 30,
  },
});