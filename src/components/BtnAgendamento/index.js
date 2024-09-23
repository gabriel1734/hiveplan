import { StyleSheet, Text, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const BtnAgendamento = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>
        <AntDesign style={styles.text} name="plussquare" size={24} color="white" />
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})

export default BtnAgendamento;