import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  focused?: boolean;
}

export default function BattleNowCurvedLabel({ focused }: Props) {
  const text = 'BATTLE NOW';
  const radius = 38;
  const startAngle = -50;
  const endAngle = 50;
  const angleStep = (endAngle - startAngle) / (text.length - 1);

  return (
    <View style={styles.container}>
      {text.split('').map((char, index) => {
        const angle = startAngle + index * angleStep;
        const radians = (angle * Math.PI) / 180;
        
        const x = radius * Math.sin(radians);
        const y = radius * (1 - Math.cos(radians)) - 8;

        return (
          <Text
            key={index}
            style={[
              styles.character,
              {
                transform: [
                  { translateX: x },
                  { translateY: y },
                  { rotate: `${angle}deg` },
                ],
              },
            ]}
          >
            {char}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  character: {
    position: 'absolute',
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
