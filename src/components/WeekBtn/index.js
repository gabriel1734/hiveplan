import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import BtnAgendamento from '../BtnAgendamento';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DayBtn from '../DayBtn';

const WeekBtn = () => {
  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState(false);
  const dates = [
    { label: '15/09 à 21/09', value: '15-09' },
    { label: '22/09 à 28/09', value: '22-09' },
    { label: '29/09 à 05/10', value: '29-09' },
    { label: '06/10 à 12/10', value: '06-10' },
    { label: '13/10 à 19/10', value: '13-10' },
    { label: '20/10 à 26/10', value: '20-10' },
    { label: '27/10 à 02/11', value: '27-10' },
    { label: '03/11 à 09/11', value: '03-11' },
    { label: '10/11 à 16/11', value: '10-11' },
    { label: '17/11 à 23/11', value: '17-11' },
    { label: '24/11 à 30/11', value: '24-11' },
    { label: '01/12 à 07/12', value: '01-12' },
    { label: '08/12 à 14/12', value: '08-12' },
    { label: '15/12 à 21/12', value: '15-12' },
    { label: '22/12 à 28/12', value: '22-12' },
    { label: '29/12 à 04/01', value: '29-12' },
  ];

  const dias = [
    { dia: '27', mes: 'AGO' },
    { dia: '28', mes: 'AGO' },
    { dia: '29', mes: 'AGO' },
    { dia: '30', mes: 'AGO' },
    { dia: '31', mes: 'AGO' },
    { dia: '01', mes: 'SET' },
    { dia: '02', mes: 'SET' },
    { dia: '03', mes: 'SET' },
    { dia: '04', mes: 'SET' },
  ];


  return (
    <>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setValue(value)}
            items={dates}
            placeholder={{
              label: dates[0].label,
              value: null,
            }}
            style={styles.pickerSelect}
            value={value}
          />
        </View>
        <View style={styles.containerBtn}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
            </Text>
          </TouchableOpacity>
          <BtnAgendamento />
        </View>
      </View>
      <View style={{marginTop: 30}}>
        <DayBtn dias={dias} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    padding: 10,
    flexDirection:'row',
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
    width: Dimensions.get('window').width / 2,
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
  button: {
    padding: 10,
    borderRadius: 10,
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6D6B69',
    borderColor: '#6D6B69',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1.5,
    shadowRadius: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnData: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#6D6B69',
    borderColor: '#6D6B69',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1.5,
    shadowRadius: 1,
    margin: 5,
  },
  btnSelected: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#6D6B69',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1.5,
    shadowRadius: 1,
    margin: 5,
  },
  btnSelectedText: {
    color: '#6D6B69',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width / 2.5,
    gap: 2,
  },
});

export default WeekBtn;