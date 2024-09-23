import React, {useState} from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";


export default function DayBtn({ dias }) {
  const [refreshing, setRefreshing] = useState(false);

  const [dia, setDia] = useState([
    ...dias,
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDia([...dia, { dia: '22', mes: 'Nov' }]);
      setRefreshing(false);
    }, 100);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dia.map((item, index) => (
          <TouchableOpacity key={index} style={styles.btnData}>
            <Text style={styles.buttonText}>{item.dia}</Text>
            <Text style={styles.buttonText}>{item.mes}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    padding: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  btnData: {
    backgroundColor: '#6D6B69',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
};

