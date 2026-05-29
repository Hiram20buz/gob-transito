import { useColorScheme } from '@/hooks/use-color-scheme';

export const PALETTE = {
  guinda: '#611232',
  guindaDk: '#3A0B1D',
  bronze: '#AC893D',
  tan: '#B69A5C',
} as const;

export const ROUTE_COLORS = {
  recA: '#AC893D',
  recB: '#B69A5C',
  recC: '#9B3450',
  personal: '#F2547A',
} as const;

export const FR_FONTS = {
  display: 'Archivo_800ExtraBold',
  displayBold: 'Archivo_700Bold',
  displaySemi: 'Archivo_600SemiBold',
  body: 'PlusJakartaSans_500Medium',
  bodyBold: 'PlusJakartaSans_700Bold',
  bodyExtra: 'PlusJakartaSans_800ExtraBold',
} as const;

export type FRTheme = {
  dark: boolean;
  bg: string;
  surface: string;
  surfaceAlt: string;
  surface2: string;
  line: string;
  lineStrong: string;
  text: string;
  textSoft: string;
  textFaint: string;
  primary: string;
  primaryText: string;
  gold: string;
  goldSoft: string;
  onGold: string;
  chipBg: string;
  shadowColor: string;
  shadowOpacity: number;
  statusText: string;
};

export function makeFRTheme(dark: boolean): FRTheme {
  if (dark) {
    return {
      dark: true,
      bg: '#240810',
      surface: '#36101e',
      surfaceAlt: '#431526',
      surface2: '#4d1a2c',
      line: 'rgba(182,154,92,0.18)',
      lineStrong: 'rgba(182,154,92,0.32)',
      text: '#F4E9DC',
      textSoft: '#cdb6a6',
      textFaint: '#9c8273',
      primary: '#7d1c41',
      primaryText: '#fff',
      gold: '#C99A45',
      goldSoft: '#B69A5C',
      onGold: '#2a0810',
      chipBg: 'rgba(182,154,92,0.14)',
      shadowColor: '#000',
      shadowOpacity: 0.55,
      statusText: '#F4E9DC',
    };
  }
  return {
    dark: false,
    bg: '#F6F1EA',
    surface: '#ffffff',
    surfaceAlt: '#fbf6ef',
    surface2: '#f3ebdf',
    line: 'rgba(58,11,29,0.10)',
    lineStrong: 'rgba(58,11,29,0.18)',
    text: '#2B0A12',
    textSoft: '#6e5660',
    textFaint: '#a08f93',
    primary: '#611232',
    primaryText: '#fff',
    gold: '#AC893D',
    goldSoft: '#B69A5C',
    onGold: '#2a0810',
    chipBg: 'rgba(172,137,61,0.14)',
    shadowColor: '#3A0B1D',
    shadowOpacity: 0.28,
    statusText: '#2B0A12',
  };
}

export function useFRTheme(): FRTheme {
  const scheme = useColorScheme();
  return makeFRTheme(scheme === 'dark');
}
