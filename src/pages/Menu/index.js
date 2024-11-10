import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import styled from "styled-components";

export default function MenuScreen({ navigation }) {
  return (
    <Container>
      <AntDesign style={styles.goBack} name="arrowleft" size={48} color="black" onPress={() => navigation.goBack()} />
      <Title>Menu</Title>
      <Button  onPress={() => navigation.navigate('Home')}>
        <AntDesign name="home" size={24} color="black" />
        <TextContainer>
          <TextMenu>
            Home
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Agendamento')}>
        <AntDesign name="calendar" size={24} color="black" />
        <TextContainer>
          <TextMenu>
            Agendamento
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Colaboradores')}>
        <AntDesign name="team" size={24} color="black" />
        <TextContainer>
          <TextMenu>
            Colaboradores
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Configuracao')}>
        <AntDesign name="setting" size={24} color="black" />
        <TextContainer>
          <TextMenu>
            Configuração
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Servicos')}>
        <AntDesign name="tool" size={24} color="black" />
        <TextContainer>
          <TextMenu>
            Serviços
          </TextMenu>
        </TextContainer>
      </Button>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-Items: center;
  justify-Content: center;
  background-color: ${props => props.theme.background};
`;

const Title = styled.Text`
  font-Size: 24px;
  font-Weight: bold;
  margin-Bottom: 20px;
  color: ${props => props.theme.text};
`;

const Button = styled(TouchableOpacity)`
  padding: 10px;
  border-Radius: 10px;
  flex-Direction: row;
  background-Color: transparent;
  width: 60%;
  border-Width: 2px;
  justify-Content: space-between;
  align-Items: center;
  border-color:${props => props.theme.primary};
  margin: 10px;
`;

const TextContainer = styled.View`
  width: 100%;
  flex-Direction: row;
  justify-Content: center;
  align-Items: center;
`;

const TextMenu = styled.Text`
  font-Size: 24;
  font-Weight: bold;
  color: ${props => props.theme.text};
`;

const styles = StyleSheet.create({
  goBack: {
    position: 'absolute',
    top: 80,
    left: 40,
  }
})