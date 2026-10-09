import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PontoRecord } from '../types/ponto';
import { calculateDayWorkedMinutes, formatMinutesToHours } from '../services/pontoService';

interface ClockDisplayProps {
  todayRecords: PontoRecord[];
  dailyGoalHours: number;
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({ todayRecords, dailyGoalHours }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Determinar status atual
  const lastRecord = todayRecords.length > 0 ? todayRecords[todayRecords.length - 1] : null;
  let statusBadge: {
    text: string;
    color: string;
    bg: string;
    icon: any;
  } = {
    text: 'Aguardando Início',
    color: '#64748B',
    bg: '#F1F5F9',
    icon: 'pause-circle-outline',
  };

  if (lastRecord) {
    if (lastRecord.type === 'entrada') {
      statusBadge = {
        text: 'Em Expediente (Trabalhando)',
        color: '#10B981',
        bg: '#D1FAE5',
        icon: 'briefcase-outline' as const,
      };
    } else if (lastRecord.type === 'almoco_saida') {
      statusBadge = {
        text: 'Em Intervalo / Almoço',
        color: '#F59E0B',
        bg: '#FEF3C7',
        icon: 'restaurant-outline' as const,
      };
    } else if (lastRecord.type === 'almoco_retorno') {
      statusBadge = {
        text: 'Em Expediente (Tarde)',
        color: '#10B981',
        bg: '#D1FAE5',
        icon: 'briefcase-outline' as const,
      };
    } else if (lastRecord.type === 'saida') {
      statusBadge = {
        text: 'Expediente Encerrado',
        color: '#6366F1',
        bg: '#EEF2FF',
        icon: 'checkmark-circle-outline' as const,
      };
    }
  }

  const workedMinutes = calculateDayWorkedMinutes(todayRecords);
  const goalMinutes = dailyGoalHours * 60;
  const progressRatio = Math.min(1, workedMinutes / Math.max(1, goalMinutes));

  return (
    <View style={styles.card}>
      <Text style={styles.dateText}>{dateString.charAt(0).toUpperCase() + dateString.slice(1)}</Text>
      
      <Text style={styles.clockText}>{timeString}</Text>

      <View style={[styles.badge, { backgroundColor: statusBadge.bg }]}>
        <Ionicons name={statusBadge.icon} size={16} color={statusBadge.color} style={{ marginRight: 6 }} />
        <Text style={[styles.badgeText, { color: statusBadge.color }]}>{statusBadge.text}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Horas Hoje</Text>
          <Text style={styles.progressValue}>
            {formatMinutesToHours(workedMinutes)} / {dailyGoalHours}h 00m
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.round(progressRatio * 100)}%`,
                backgroundColor: progressRatio >= 1 ? '#10B981' : '#3B82F6',
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  clockText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 18,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
