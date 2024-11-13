import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import styled from "styled-components";

export default function MenuScreen({ navigation }) {
  return (
    <Container>
      <GoBack name="arrowleft" size={48} onPress={() => navigation.goBack()} />
      <Title>Menu</Title>
      <Button  onPress={() => navigation.navigate('Home')}>
        <DesignColor name="home" size={24}/>
        <TextContainer>
          <TextMenu>
            Home
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Agendamento')}>
        <DesignColor name="calendar" size={24}/>
        <TextContainer>
          <TextMenu>
            Agendamento
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Colaboradores')}>
        <DesignColor name="team" size={24} />
        <TextContainer>
          <TextMenu>
            Colaboradores
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Configuracao')}>
        <DesignColor name="setting" size={24}/>
        <TextContainer>
          <TextMenu>
            Configuração
          </TextMenu>
        </TextContainer>
      </Button>
      <Button onPress={() => navigation.navigate('Servicos')}>
        <DesignColor name="tool" size={24}/>
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

const GoBack = styled(AntDesign)`
  position: absolute;
  top: 80;
  left: 40;
  color: ${props => props.theme.text};
`

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

const DesignColor = styled(AntDesign)`
  color: ${props=> props.theme.text};
`;