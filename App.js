import { SQLiteProvider } from 'expo-sqlite';
import { StyleSheet, Text, View } from 'react-native';
import { adicionarAgendamento, create, excluirAgendamento, verAgendamentos } from './src/database';
import { Button } from 'react-native';


export default function App() {

  verAgendamentos();
  return (
    <SQLiteProvider databaseName='database.db' onInit={create}>
    <View style={styles.container}>
      <Button 
      onPress={ () => {
        adicionarAgendamento("hoje","hora",1,"cliente","telefone","");
      }}
      title = "botão"
      />
      <Button onPress={() => {
        excluirAgendamento(66)
      }}
      title='excluir'/>
    </View>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
