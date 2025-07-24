import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DATES = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, null, null],
];

export default function CalendarScreen() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{ marginTop: 88 }}>
        <Text style={[styles.monthLabel, { color: theme.text }]}>June 2024</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <Text key={day} style={[styles.dayLabel, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>{day}</Text>
          ))}
        </View>
        {DATES.map((week, i) => (
          <View key={i} style={styles.daysRow}>
            {week.map((date, j) => (
              <View key={j} style={styles.dateCell}>
                {date ? (
                  <Text style={[styles.dateText, { color: theme.text }]}>{date}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const cellSize = Math.floor((Dimensions.get('window').width - 32) / 7);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: 8,
  },
  monthLabel: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    marginBottom: 18,
    letterSpacing: 1,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dayLabel: {
    width: cellSize,
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    marginBottom: 6,
  },
  dateCell: {
    width: cellSize,
    height: cellSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: cellSize / 2,
  },
  dateText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
}); 