import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { inicializeDatabase } from './database/inicializeDataBase';


export default function App() {
  return (
    <SQLiteProvider databaseName='myDataBase.db' onInit={inicializeDatabase}>
    <View style={styles.container}>
      <Text>Olár</Text>
      <StatusBar style="auto" />
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
