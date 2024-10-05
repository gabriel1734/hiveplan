import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import BtnAgendamento from '../BtnAgendamento';
import DayBtn from '../DayBtn';
import { DataContext } from '../../pages/HomeScreen';
import { getDaysOfWeek, verSemanasComAgendamentos } from '../../database';

const WeekBtn = ({navigation}) => {
  const { data, setData } = useContext(DataContext);
  const [selectedValue, setSelectedValue] = useState(data);
  const dates = verSemanasComAgendamentos();
  const [dias, setDias] = useState(getDaysOfWeek(data));

  useEffect(() => {
    if (data !== selectedValue) {
      setDias(getDaysOfWeek(data));
      setSelectedValue(data);
    }
  }, [data]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => {
              if (value !== data) {
                setData(value);
              }
            }}
            items={dates}
            placeholder={{
              label: dates.length > 0 ? dates[0].label : 'Selecione a semana', // Ajusta o placeholder
              value: null,
            }}
            style={styles.pickerSelect}
            value={selectedValue}
          />
        </View>
        <BtnAgendamento navigation={navigation} />
      </View>
      <View style={{ marginTop: 30 }}>
        <DayBtn dias={dias} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: 30,
    width: Dimensions.get('window').width,
  },
  scrollView: {
    flexDirection: 'row',
  },
  pickerContainer: {
    width: Dimensions.get('window').width / 1.5,
    height: 50,
    color: '#6D6B69',
  },
  pickerSelect: {
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 50,
    },
    iconContainer: {
      right: 10,
    },
  },
});

export default WeekBtn;
