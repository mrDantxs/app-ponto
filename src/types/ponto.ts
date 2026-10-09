export type PontoType = 'entrada' | 'almoco_saida' | 'almoco_retorno' | 'saida';

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export interface PontoRecord {
  id: string;
  timestamp: number; // Unix timestamp em ms
  type: PontoType;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm:ss
  location?: LocationInfo;
  notes?: string;
  hashAuth: string; // Código de autenticação / NSR
  synced: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  cpf: string;
  matricula: string;
  empresa: string;
  cnpj: string;
  dailyHoursGoal: number; // em horas (ex: 8)
}

export interface DaySummary {
  dateStr: string;
  records: PontoRecord[];
  totalWorkedMinutes: number;
  expectedMinutes: number;
  balanceMinutes: number;
  isComplete: boolean;
}
