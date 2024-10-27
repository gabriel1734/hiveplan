import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const BtnAgendamento = ({ navigation }) => {
  const handleCreateOrEditAgendamento = () => {
    navigation.navigate('Agendamento'); // Navigate to the 'Agendamento' screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCreateOrEditAgendamento}>
        <Text style={styles.buttonText}>
          <AntDesign style={styles.text} name="plussquare" size={40} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Fixa o botão no rodapé
    bottom: 0, // Distância do rodapé
    left: 0,
    right: 0,
    alignItems: 'center', // Centraliza o botão horizontalmente
  },
  button: {
    padding: 1,
    borderRadius: 10,
    backgroundColor: "#6D6B69",
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default BtnAgendamento;
