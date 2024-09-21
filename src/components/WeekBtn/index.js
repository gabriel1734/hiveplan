import React, { useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const WeekBtn = () => {
  const [value, setValue] = useState(null);

  const items = [
    { label: 'Opção 1', value: 'option1' },
    { label: 'Opção 2', value: 'option2' },
    { label: 'Opção 3', value: 'option3' },
  ];

  return (
    <View>
      <RNPickerSelect
        onValueChange={(value) => setValue(value)}
        items={items}
        placeholder={{
          label: 'Selecione uma opção',
          value: null,
        }}
        style={{
          inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
          },
        }}
        value={value}
      />
    </View>
  );
};

export default WeekBtn;