import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import { DataTheme } from '../../context';
import light from '../../theme/light';
import theme from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

const Header = () => {

  const { theme } = useContext(DataTheme);
  const [logo, setLogo] = useState('');

  const backgroundColor = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];

  useEffect(() => {
   const logoEmpresa = AsyncStorage.getItem('logo');
   if(logoEmpresa){
     setLogo(true);
   } else {
    setLogo(false)
   }
  },[])

  return (
      <LinearGradient colors={backgroundColor} style={styles.header}>
        <Image source={logo ? theme === light ? require('../../../assets/img/HIVEPLAN.png') :  require('../../../assets/img/HIVEPLAN-WHITE.png') : require('../../../assets/img/HIVEPLAN.png')} style={{width: 50, height: 50}} />
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
    height: 100,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;