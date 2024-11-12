import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components';

const Header = () => {

  return (
    <Container>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
        
      </LinearGradient>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.background};
  padding: 15px;
  flex-Direction: row;
  justify-Content: space-between;
  align-Items: flex-end;
  border-Radius: 0px;
`;

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: 0,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;