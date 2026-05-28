import { Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { FR_FONTS } from '@/constants/fastroute-theme';

type LogoProps = { size?: number; color?: string; accent?: string };

export function Logo({ size = 38, color = '#fff', accent = '#AC893D' }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="20" stroke={color} strokeOpacity={0.22} strokeWidth={2} />
      <Path
        d="M12 31 C12 22 20 24 22 18 C24 12 32 14 32 14"
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="12" cy="31" r="4" fill={color} />
      <Circle cx="32" cy="14" r="4" fill={accent} />
    </Svg>
  );
}

type WordmarkProps = { color?: string; accent?: string; size?: number };

export function Wordmark({ color = '#fff', accent = '#AC893D', size = 22 }: WordmarkProps) {
  return (
    <Text
      style={{
        fontFamily: FR_FONTS.display,
        fontSize: size,
        letterSpacing: -0.5,
        color,
      }}>
      Fast<Text style={{ color: accent }}>Route</Text>
    </Text>
  );
}
