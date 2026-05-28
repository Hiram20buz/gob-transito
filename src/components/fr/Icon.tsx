import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'pin' | 'nav' | 'search' | 'swap' | 'clock' | 'star' | 'route'
  | 'chevR' | 'chevL' | 'chevD' | 'chevU' | 'plus' | 'minus' | 'undo'
  | 'trash' | 'check' | 'x' | 'user' | 'shield' | 'lock' | 'mail'
  | 'eye' | 'file' | 'download' | 'chart' | 'bell' | 'users' | 'layers'
  | 'flag' | 'gauge' | 'settings' | 'logout' | 'money' | 'leaf' | 'bolt'
  | 'cal' | 'target';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  fill?: string;
};

export function Icon({ name, size = 22, color = '#000', stroke = 2, fill = 'none' }: IconProps) {
  const svg = (children: React.ReactNode) => (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round">
      {children}
    </Svg>
  );

  switch (name) {
    case 'pin':
      return svg(<><Path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><Circle cx="12" cy="10" r="2.4" /></>);
    case 'nav':
      return svg(<Path d="M3 11l18-8-8 18-2-7-8-3Z" />);
    case 'search':
      return svg(<><Circle cx="11" cy="11" r="7" /><Path d="m20 20-3.2-3.2" /></>);
    case 'swap':
      return svg(<><Path d="M7 4v16" /><Path d="m3.5 7.5 3.5-3.5 3.5 3.5" /><Path d="M17 20V4" /><Path d="m20.5 16.5-3.5 3.5-3.5-3.5" /></>);
    case 'clock':
      return svg(<><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3 2" /></>);
    case 'star':
      return svg(<Path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17.9 6.7 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />);
    case 'route':
      return svg(<><Circle cx="6" cy="19" r="2.5" /><Circle cx="18" cy="5" r="2.5" /><Path d="M8.5 19H14a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5.5" /></>);
    case 'chevR':
      return svg(<Path d="m9 6 6 6-6 6" />);
    case 'chevL':
      return svg(<Path d="m15 6-6 6 6 6" />);
    case 'chevD':
      return svg(<Path d="m6 9 6 6 6-6" />);
    case 'chevU':
      return svg(<Path d="m6 15 6-6 6 6" />);
    case 'plus':
      return svg(<><Path d="M12 5v14" /><Path d="M5 12h14" /></>);
    case 'minus':
      return svg(<Path d="M5 12h14" />);
    case 'undo':
      return svg(<><Path d="M9 14 4 9l5-5" /><Path d="M4 9h11a5 5 0 0 1 0 10h-3" /></>);
    case 'trash':
      return svg(<><Path d="M4 7h16" /><Path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><Path d="M6 7l1 13h10l1-13" /></>);
    case 'check':
      return svg(<Path d="m4 12 5 5L20 6" />);
    case 'x':
      return svg(<><Path d="M6 6l12 12" /><Path d="M18 6 6 18" /></>);
    case 'user':
      return svg(<><Circle cx="12" cy="8" r="4" /><Path d="M4 20a8 8 0 0 1 16 0" /></>);
    case 'shield':
      return svg(<><Path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3Z" /><Path d="m9 12 2 2 4-4" /></>);
    case 'lock':
      return svg(<><Rect x="5" y="11" width="14" height="9" rx="2" /><Path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
    case 'mail':
      return svg(<><Rect x="3" y="5" width="18" height="14" rx="2" /><Path d="m3 7 9 6 9-6" /></>);
    case 'eye':
      return svg(<><Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><Circle cx="12" cy="12" r="3" /></>);
    case 'file':
      return svg(<><Path d="M14 3v5h5" /><Path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5Z" /></>);
    case 'download':
      return svg(<><Path d="M12 4v11" /><Path d="m8 11 4 4 4-4" /><Path d="M5 19h14" /></>);
    case 'chart':
      return svg(<><Path d="M4 4v16h16" /><Path d="M8 16v-4" /><Path d="M12 16V8" /><Path d="M16 16v-7" /></>);
    case 'bell':
      return svg(<><Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><Path d="M13.7 21a2 2 0 0 1-3.4 0" /></>);
    case 'users':
      return svg(<><Circle cx="9" cy="8" r="3.5" /><Path d="M3 20a6 6 0 0 1 12 0" /><Path d="M16 5a3.5 3.5 0 0 1 0 7" /><Path d="M18 14a6 6 0 0 1 3 5" /></>);
    case 'layers':
      return svg(<><Path d="m12 3 9 5-9 5-9-5 9-5Z" /><Path d="m3 13 9 5 9-5" /></>);
    case 'flag':
      return svg(<><Path d="M5 21V4" /><Path d="M5 4h11l-2 4 2 4H5" /></>);
    case 'gauge':
      return svg(<><Path d="M12 14 16 9" /><Circle cx="12" cy="13" r="8" /><Path d="M12 5v1M5 13H4M20 13h-1" /></>);
    case 'settings':
      return svg(<><Circle cx="12" cy="12" r="3" /><Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></>);
    case 'logout':
      return svg(<><Path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" /><Path d="m16 17 5-5-5-5" /><Path d="M21 12H9" /></>);
    case 'money':
      return svg(<><Circle cx="12" cy="12" r="9" /><Path d="M12 7v10M9.5 9.5a2.2 2.2 0 0 1 2.5-1.5c1.4 0 2 .8 2 1.6 0 2-4.5 1.2-4.5 3.2 0 .9.8 1.7 2.3 1.7a2.4 2.4 0 0 0 2.4-1.4" /></>);
    case 'leaf':
      return svg(<><Path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14" /><Path d="M9 15c2-3 5-5 8-6" /></>);
    case 'bolt':
      return svg(<Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />);
    case 'cal':
      return svg(<><Rect x="3" y="5" width="18" height="16" rx="2" /><Path d="M3 9h18M8 3v4M16 3v4" /></>);
    case 'target':
      return svg(<><Circle cx="12" cy="12" r="8" /><Circle cx="12" cy="12" r="3.4" /></>);
    default:
      return null;
  }
}
