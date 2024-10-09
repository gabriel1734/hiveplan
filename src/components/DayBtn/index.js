import React, { useState, useEffect, useContext } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DataContext } from '../../pages/HomeScreen';

export default function DayBtn({ dias }) {
  const { data, setData } = useContext(DataContext);
  const [refreshing, setRefreshing] = useState(false);
  const [dia, setDia] = useState(dias);

  useEffect(() => {
    onRefresh();
  }, [dias]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDia([...dias]);
      setRefreshing(false);
    }, 1000);
  };

  const handleDayPress = (selectedDay) => {
    console.log(selectedDay);
    setData(selectedDay);
  };

  

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
          <TouchableOpacity
            key={index}
            style={data == item.date ? styles.btnDataSelected : styles.btnData}
            onPress={() => handleDayPress(item.date)} 
          >
            <Text style={data == item.date ? styles.buttonTextSelected : styles.buttonText}>{item.dia}</Text>
            <Text style={data == item.date ? styles.buttonTextSelected : styles.buttonText}>{item.mes}</Text>
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
  btnDataSelected: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonTextSelected: {
    color: '#6D6B69',
  },
};
