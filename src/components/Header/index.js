import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import { DataTheme } from '../../context';
import light from '../../theme/light';
import theme from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { viewEmpresa } from '../../database';

const Header = () => {

  const { theme } = useContext(DataTheme);
  const [logo, setLogo] = useState('');
  const [nome, setNome] = useState('HivePlan');

  const backgroundColor = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];
  const getData = async () => {
   const uri = await AsyncStorage.getItem('logo');
    if (uri) {
      setLogo(uri);
    }
    const empresa = await viewEmpresa();
    if(empresa) {
      setNome(empresa.nomeEmpresa);
    }
    console.log(empresa);
  }

  useEffect(() => {
    getData();
    
  },[])

  return (
    <LinearGradient colors={backgroundColor} style={styles.header}>
      <Text style={styles.text}>{nome}</Text>
        <Image style={styles.img} source={logo ? logo : theme === light ? require('../../../assets/img/HIVEPLAN.png') :  require('../../../assets/img/HIVEPLAN-WHITE.png')} />
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    height: 120,
    padding: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    maxWidth: '50%',
    marginTop: 10,
  },
  img: {
    marginTop: 10,
    width: 100,
    height: 100,
    padding: 20
  }
});

export default Header;