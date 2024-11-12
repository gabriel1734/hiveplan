import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components';
import { useContext } from 'react';
import { DataTheme } from '../../context';
import light from '../../theme/light';
import theme from '../../theme';

const Header = () => {

  const { theme } = useContext(DataTheme);

  const backgroundColor = theme === light ? ['#F7FF89', '#F6FF77', '#E8F622'] : ['#bb86fc', '#bb86fc', '#bb86fc'];

  return (
      <LinearGradient colors={backgroundColor} style={styles.header}>
        
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