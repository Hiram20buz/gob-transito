import { IconName } from '@/components/fr/Icon';
import { ROUTE_COLORS } from '@/constants/fastroute-theme';

export type TrafficKey = 'fluido' | 'moderado' | 'denso';

export type Recommended = {
  id: string;
  name: string;
  tag: string;
  icon: IconName;
  color: string;
  eta: number;
  dist: number;
  traffic: TrafficKey;
  trafficLvl: 0 | 1 | 2;
  cost: number;
  path: string;
};

export type HistoryItem = {
  id: string;
  from: string;
  to: string;
  date: string;
  dist: number;
  min: number;
  fav: boolean;
};

export type Approval = {
  id: string;
  user: string;
  from: string;
  to: string;
  dist: number;
  points: number;
  date: string;
  path: string;
};

export type Report = {
  id: string;
  name: string;
  type: 'PDF' | 'CSV' | 'XLSX' | 'DOCX';
  size: string;
  date: string;
};

export type ChartPoint = { d: string; v: number };

export const TRAFFIC: Record<TrafficKey, { label: string; color: string }> = {
  fluido: { label: 'Fluido', color: '#3F9B6B' },
  moderado: { label: 'Moderado', color: '#C99A45' },
  denso: { label: 'Denso', color: '#C0573E' },
};

export const RECOMMENDED: Recommended[] = [
  {
    id: 'r1',
    name: 'Vía Reforma',
    tag: 'Rápida',
    icon: 'bolt',
    color: ROUTE_COLORS.recA,
    eta: 24,
    dist: 12.4,
    traffic: 'fluido',
    trafficLvl: 0,
    cost: 38,
    path: 'M14,150 C70,120 110,90 150,70 200,46 250,40 312,30',
  },
  {
    id: 'r2',
    name: 'Eje Central',
    tag: 'Económica',
    icon: 'money',
    color: ROUTE_COLORS.recB,
    eta: 31,
    dist: 10.1,
    traffic: 'moderado',
    trafficLvl: 1,
    cost: 22,
    path: 'M14,150 C60,150 90,130 130,118 190,100 240,86 312,52',
  },
  {
    id: 'r3',
    name: 'Av. Chapultepec',
    tag: 'Escénica',
    icon: 'leaf',
    color: ROUTE_COLORS.recC,
    eta: 36,
    dist: 13.8,
    traffic: 'denso',
    trafficLvl: 2,
    cost: 18,
    path: 'M14,150 C50,170 88,168 132,150 196,124 236,128 312,78',
  },
];

export const HISTORY: HistoryItem[] = [
  { id: 'h1', from: 'Casa', to: 'Oficina Reforma', date: 'Hoy · 08:14', dist: 12.4, min: 26, fav: true },
  { id: 'h2', from: 'Oficina Reforma', to: 'Polanco', date: 'Ayer · 19:40', dist: 6.2, min: 18, fav: false },
  { id: 'h3', from: 'Casa', to: 'Aeropuerto AICM', date: '26 may · 06:10', dist: 18.9, min: 41, fav: true },
  { id: 'h4', from: 'Coyoacán', to: 'UNAM', date: '24 may · 13:05', dist: 4.8, min: 15, fav: false },
  { id: 'h5', from: 'Roma Norte', to: 'Condesa', date: '23 may · 21:18', dist: 2.1, min: 9, fav: false },
];

export const APPROVALS: Approval[] = [
  { id: 'a1', user: 'María G.', from: 'Tlalpan', to: 'Centro Histórico', dist: 15.2, points: 6, date: 'Hace 12 min', path: 'M10,70 C40,40 80,80 120,52 160,28 190,70 230,44' },
  { id: 'a2', user: 'Carlos R.', from: 'Santa Fe', to: 'Insurgentes Sur', dist: 9.7, points: 4, date: 'Hace 38 min', path: 'M10,40 C50,70 90,30 130,60 170,82 200,40 230,66' },
  { id: 'a3', user: 'Lucía M.', from: 'Iztapalapa', to: 'Zócalo', dist: 11.4, points: 5, date: 'Hace 1 h', path: 'M10,60 C44,76 78,40 118,58 158,74 196,36 230,58' },
  { id: 'a4', user: 'Diego F.', from: 'Narvarte', to: 'Del Valle', dist: 3.6, points: 3, date: 'Hace 2 h', path: 'M10,52 C50,30 92,72 132,48 172,28 198,64 230,46' },
];

export const REPORTS: Report[] = [
  { id: 'f1', name: 'Reporte mensual de rutas', type: 'PDF', size: '2.4 MB', date: '01 may 2026' },
  { id: 'f2', name: 'Tráfico por zona — Q2', type: 'CSV', size: '880 KB', date: '15 may 2026' },
  { id: 'f3', name: 'Rutas personalizadas aprobadas', type: 'XLSX', size: '1.1 MB', date: '20 may 2026' },
  { id: 'f4', name: 'Demanda por horario', type: 'PDF', size: '3.0 MB', date: '25 may 2026' },
];

export const CHART_DATA: ChartPoint[] = [
  { d: 'L', v: 62 },
  { d: 'M', v: 78 },
  { d: 'M', v: 71 },
  { d: 'J', v: 88 },
  { d: 'V', v: 96 },
  { d: 'S', v: 54 },
  { d: 'D', v: 40 },
];

export const FILE_TINT: Record<Report['type'], string> = {
  PDF: '#C0573E',
  CSV: '#3F9B6B',
  XLSX: '#2E7D52',
  DOCX: '#2A6FDB',
};

export const TEST_USERS = {
  user: { id: 'user_mock_001', email: 'usuario@fastroute.mx', password: 'usuario123', name: 'Jorge A.' },
  admin: { id: 'admin_mock_001', email: 'admin@fastroute.mx', password: 'admin123', name: 'Admin · Operaciones' },
} as const;
