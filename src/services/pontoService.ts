import { PontoRecord, PontoType, DaySummary } from '../types/ponto';

export const PONTO_TYPE_CONFIG: Record<
  PontoType,
  { label: string; shortLabel: string; color: string; badgeBg: string; icon: string }
> = {
  entrada: {
    label: 'Entrada no Expediente',
    shortLabel: 'Entrada',
    color: '#10B981',
    badgeBg: '#D1FAE5',
    icon: 'log-in-outline',
  },
  almoco_saida: {
    label: 'Saída para Refeição',
    shortLabel: 'Saída Almoço',
    color: '#F59E0B',
    badgeBg: '#FEF3C7',
    icon: 'restaurant-outline',
  },
  almoco_retorno: {
    label: 'Retorno da Refeição',
    shortLabel: 'Retorno Almoço',
    color: '#3B82F6',
    badgeBg: '#DBEAFE',
    icon: 'time-outline',
  },
  saida: {
    label: 'Fim de Expediente',
    shortLabel: 'Saída',
    color: '#EF4444',
    badgeBg: '#FEE2E2',
    icon: 'log-out-outline',
  },
};

export function generatePontoHash(timestamp: number, matricula: string): string {
  const chars = '0123456789ABCDEF';
  let hash = '';
  const seed = `${timestamp}-${matricula}`;
  for (let i = 0; i < 24; i++) {
    const idx = (seed.charCodeAt(i % seed.length) * (i + 13) + (timestamp % 97)) % chars.length;
    hash += chars[idx];
  }
  return hash.match(/.{1,4}/g)?.join('-') ?? hash;
}

export function formatDateToIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeToIso(d: Date): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function formatMinutesToHours(minutes: number): string {
  const isNegative = minutes < 0;
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const str = `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  return isNegative ? `-${str}` : str;
}

export function getSuggestedNextType(todayRecords: PontoRecord[]): PontoType {
  const count = todayRecords.length;
  if (count === 0) return 'entrada';
  if (count === 1) return 'almoco_saida';
  if (count === 2) return 'almoco_retorno';
  return 'saida';
}

export function calculateDayWorkedMinutes(records: PontoRecord[]): number {
  if (records.length === 0) return 0;

  // Ordena por timestamp
  const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);

  let totalMinutes = 0;
  let currentStart: number | null = null;

  for (const r of sorted) {
    if (r.type === 'entrada' || r.type === 'almoco_retorno') {
      currentStart = r.timestamp;
    } else if (r.type === 'almoco_saida' || r.type === 'saida') {
      if (currentStart !== null) {
        const diffMs = r.timestamp - currentStart;
        totalMinutes += Math.max(0, Math.floor(diffMs / 60000));
        currentStart = null;
      }
    }
  }

  // Se a jornada ainda está aberta hoje e não fechou, calcula até o momento atual se for o dia de hoje
  if (currentStart !== null) {
    const todayStr = formatDateToIso(new Date());
    const isToday = records.some((r) => r.dateStr === todayStr);
    if (isToday) {
      const nowMs = Date.now();
      const diffMs = nowMs - currentStart;
      totalMinutes += Math.max(0, Math.floor(diffMs / 60000));
    }
  }

  return totalMinutes;
}

export function groupRecordsByDate(records: PontoRecord[], dailyGoalHours: number): DaySummary[] {
  const map: Record<string, PontoRecord[]> = {};

  for (const r of records) {
    if (!map[r.dateStr]) {
      map[r.dateStr] = [];
    }
    map[r.dateStr].push(r);
  }

  const result: DaySummary[] = [];
  const expectedMinutes = dailyGoalHours * 60;

  const dates = Object.keys(map).sort((a, b) => b.localeCompare(a)); // decrescente

  for (const d of dates) {
    const dayRecords = map[d].sort((a, b) => a.timestamp - b.timestamp);
    const workedMinutes = calculateDayWorkedMinutes(dayRecords);
    const isComplete = dayRecords.some((r) => r.type === 'saida') && dayRecords.length >= 2;

    result.push({
      dateStr: d,
      records: dayRecords,
      totalWorkedMinutes: workedMinutes,
      expectedMinutes,
      balanceMinutes: workedMinutes - expectedMinutes,
      isComplete,
    });
  }

  return result;
}
