import React, { useState, useEffect, useContext } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DataContext } from "../../context";
import styled from "styled-components";

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
    <Container>
      <StyledScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dia.map((item, index) => (
          <Button
            key={index}
            onPress={() => handleDayPress(item.date)} 
          >

            <ButtonText>{item.dia}/{item.mes}</ButtonText>
            <ButtonText>{item.sem}</ButtonText>
            
          </Button>
        ))}
      </StyledScrollView>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${props => props.theme.background};
  padding:10px;
`;

const StyledScrollView = styled.ScrollView`
  flex-direction: row;
`

const Button = styled(TouchableOpacity)`
  padding: 10px;
  border-Radius: 10px;  
  flex-Direction: column;
  margin-right:5px;
  margin-left:5px;
  align-Items: center;
  justify-Content: 'center';
  background-color: ${props=> props.theme.buttonBackground};
`;

const ButtonText = styled.Text`
 color: ${props => props.theme.buttonText};
`;

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
