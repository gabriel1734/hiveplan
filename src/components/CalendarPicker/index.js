import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarPicker = () => {
  const [selectedDate, setSelectedDate] = useState('2023-11-22'); // Data inicial selecionada

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        selected={selectedDate}
        markedDates={{
          [selectedDate]: { selected: true, disableTouchEvent: true }
        }}
      />
    </View>
  );
};

export default CalendarPicker;