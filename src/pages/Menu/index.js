import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AntDesign style={styles.goBack} name="arrowleft" size={48} color="black" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Menu</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
        <AntDesign name="home" size={24} color="black" />
        <View style={styles.textBtn}>
          <Text style={styles.text}>
            Home
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Agendamento')}>
        <AntDesign name="calendar" size={24} color="black" />
        <View style={styles.textBtn}>
          <Text style={styles.text}>
            Agendamento
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Colaboradores')}>
        <AntDesign name="team" size={24} color="black" />
        <View style={styles.textBtn}>
          <Text style={styles.text}>
            Colaboradores
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Configuracao')}>
        <AntDesign name="setting" size={24} color="black" />
        <View style={styles.textBtn}>
          <Text style={styles.text}>
            Configuração
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Servicos')}>
        <AntDesign name="tool" size={24} color="black" />
        <View style={styles.textBtn}>
          <Text style={styles.text}>
            Serviços
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: "transparent",
    width: '60%',
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goBack: {
    position: 'absolute',
    top: 80,
    left: 40,
  },
  textBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})