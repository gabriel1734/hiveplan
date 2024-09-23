import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default Agendamento = ({ horario, servico, cliente }) => {
  return (
    <View style={styles.agendamento}>
      <Text style={styles.horario}>{horario}</Text>
      <View style={styles.servicoCliente}>
        <MaterialIcons name="pets" size={24} color="white" />
        <View style={styles.info}>
          <Text style={styles.infoText}>{servico}</Text>
          <Text style={styles.infoText}>{cliente}</Text>
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
    marginLeft: 10,
  },
  infoText: {
    color: 'white',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});