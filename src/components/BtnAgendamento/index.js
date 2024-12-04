import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styled from 'styled-components';

import { Entypo } from '@expo/vector-icons';

const BtnAgendamento = ({ navigation }) => {
  const handleCreateOrEditAgendamento = () => {
    navigation.navigate('Menu'); // Navigate to the 'Agendamento' screen
  };

  return (
    <Container>
      <StyledButton onPress={handleCreateOrEditAgendamento}>
        <StyledText>
          <Entypo style={styles.text} name="menu" size={40} />
        </StyledText>
      </StyledButton>
    </Container>
  );
};

const Container = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0px;
  right: 0px;
  align-items: center;
  color: green;
`;

const StyledButton = styled.TouchableOpacity`
  padding: 1px;
  border-Radius: 10px;
  background-Color: ${props=> props.theme.buttonBackground};
  align-Items: center;
  justify-Content: center;
  width: 100;
  height: 50;
`;

const StyledText = styled.Text`
  font-Size: 40px;
  font-Weight: bold;
  color: ${props=> props.theme.buttonText};
`;

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
