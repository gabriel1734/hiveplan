import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import DayBtn from '../DayBtn';
import { DataContext } from '../../pages/HomeScreen';
import { getDaysOfWeek } from '../../database';

const WeekBtn = ({navigation}) => {
  const { data } = useContext(DataContext);
  const [dias, setDias] = useState(getDaysOfWeek(data));

  useEffect(() => {
    setDias(getDaysOfWeek(data));
  }, [data]);
  
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.TextSemana}>Semana</Text>
        
      </View>
      <View style={{ marginTop: 10 }}>
        <DayBtn dias={dias} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  TextSemana: {
    fontSize: 24,
    color: '#6D6B69',
    fontWeight: 'bold',
  },
});

export default WeekBtn;
