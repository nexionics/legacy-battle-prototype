import React from 'react';
import Svg, { Defs, Path, Text as SvgText, TextPath } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface Props {
  focused?: boolean;
}

export default function BattleNowCurvedLabel({ focused }: Props) {
  const textColor = COLORS.white;

  return (
    <Svg width={80} height={20} style={{ marginTop: 2 }}>
      <Defs>
        <Path
          id="battleNowArc"
          d="M 5 2 A 35 35 0 0 0 75 2"
        />
      </Defs>
      <SvgText
        fill={textColor}
        fontSize={9}
        fontWeight="600"
        textAnchor="middle"
      >
        <TextPath href="#battleNowArc" startOffset="50%">
          Battle Now
        </TextPath>
      </SvgText>
    </Svg>
  );
}
