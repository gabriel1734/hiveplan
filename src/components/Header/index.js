import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = () => {

  return (
    <View>
      <LinearGradient colors={['#F7FF89', '#F6FF77', '#E8F622']} style={styles.header}>
        
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: 0,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;