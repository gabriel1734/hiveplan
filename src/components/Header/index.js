import {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // ou outra biblioteca de ícones
import { LinearGradient } from 'expo-linear-gradient';
import { AgendamentoScreenContext } from '../../../App';

const Header = () => {
  
  const {createOrEditAgendamento} = useContext(AgendamentoScreenContext)

  return (
    <View>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
        <Text style={styles.text}>{createOrEditAgendamento ? '': 'olá'}</Text>
        {createOrEditAgendamento ? <AntDesign name="menu-unfold" size={24} color="black" /> : null}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;