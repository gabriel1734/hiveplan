import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import DayBtn from '../DayBtn';
import { DataContext } from '../../pages/HomeScreen';
import { getDaysOfWeek } from '../../database';
import styled from 'styled-components';

const WeekBtn = ({navigation}) => {
  const { data } = useContext(DataContext);
  const [dias, setDias] = useState(getDaysOfWeek(data));

  useEffect(() => {
    setDias(getDaysOfWeek(data));
  }, [data]);
  
  return (
    <>
      <Container>
        <StyledText>Semana</StyledText>
      </Container>
      <View style={{ marginTop: 10 }}>
        <DayBtn dias={dias} />
      </View>
    </>
  );
};

const Container = styled.View`
  height: 50px;
  padding: 10px;
  flex-Direction: row;
  align-Items: center;
  justify-Content: space-between;
  background-color: ${props => props.theme.background};
  border-Radius: 10px;
  margin-Top: 10px;
  width: '100%';
`;

const StyledText = styled.Text`
  font-size:24px;
  color: ${props => props.theme.text};
  font-weight: bold;
`;

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
