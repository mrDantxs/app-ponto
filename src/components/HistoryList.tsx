import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PontoRecord, DaySummary } from '../types/ponto';
import {
  PONTO_TYPE_CONFIG,
  groupRecordsByDate,
  formatMinutesToHours,
  formatDateToIso,
} from '../services/pontoService';

interface HistoryListProps {
  records: PontoRecord[];
  dailyGoalHours: number;
  onSelectRecord: (record: PontoRecord) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  records,
  dailyGoalHours,
  onSelectRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'hoje' | 'espelho'>('hoje');

  const todayStr = formatDateToIso(new Date());
  const todayRecords = records.filter((r) => r.dateStr === todayStr);
  const daySummaries = groupRecordsByDate(records, dailyGoalHours);

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hoje' && styles.tabButtonActive]}
          onPress={() => setActiveTab('hoje')}
        >
          <Text style={[styles.tabText, activeTab === 'hoje' && styles.tabTextActive]}>
            Registros de Hoje ({todayRecords.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'espelho' && styles.tabButtonActive]}
          onPress={() => setActiveTab('espelho')}
        >
          <Text style={[styles.tabText, activeTab === 'espelho' && styles.tabTextActive]}>
            Espelho de Ponto
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da Aba Hoje */}
      {activeTab === 'hoje' ? (
        <View style={styles.tabContent}>
          {todayRecords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={42} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Nenhum ponto batido hoje</Text>
              <Text style={styles.emptySubtitle}>
                Clique no botão de registro acima para marcar seu primeiro ponto do dia.
              </Text>
            </View>
          ) : (
            <View style={styles.recordsList}>
              {todayRecords
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((item) => {
                  const config = PONTO_TYPE_CONFIG[item.type];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.recordItem}
                      onPress={() => onSelectRecord(item)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.recordIconCircle, { backgroundColor: config.badgeBg }]}>
                        <Ionicons name={config.icon as any} size={20} color={config.color} />
                      </View>

                      <View style={styles.recordDetails}>
                        <View style={styles.recordRowTop}>
                          <Text style={styles.recordLabel}>{config.label}</Text>
                          <Text style={styles.recordTime}>{item.timeStr}</Text>
                        </View>

                        <View style={styles.recordRowBottom}>
                          <Text style={styles.recordLocation} numberOfLines={1}>
                            <Ionicons name="location-outline" size={12} color="#94A3B8" />{' '}
                            {item.location?.address || 'Localização obtida'}
                          </Text>
                          <Text style={styles.viewReceiptLink}>Ver comprovante</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
        </View>
      ) : (
        /* Conteúdo da Aba Espelho */
        <View style={styles.tabContent}>
          {daySummaries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={42} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Sem histórico disponível</Text>
              <Text style={styles.emptySubtitle}>Seus dias trabalhados aparecerão aqui.</Text>
            </View>
          ) : (
            daySummaries.map((summary) => {
              const formattedDate = summary.dateStr.split('-').reverse().join('/');
              const isPositive = summary.balanceMinutes >= 0;

              return (
                <View key={summary.dateStr} style={styles.daySummaryCard}>
                  <View style={styles.daySummaryHeader}>
                    <View>
                      <Text style={styles.daySummaryDate}>{formattedDate}</Text>
                      <Text style={styles.daySummaryPunches}>
                        {summary.records.length} batidas registradas
                      </Text>
                    </View>
                    <View style={styles.daySummaryRight}>
                      <Text style={styles.daySummaryWorked}>
                        {formatMinutesToHours(summary.totalWorkedMinutes)}
                      </Text>
                      <Text
                        style={[
                          styles.daySummaryBalance,
                          { color: isPositive ? '#10B981' : '#EF4444' },
                        ]}
                      >
                        Saldo: {formatMinutesToHours(summary.balanceMinutes)}
                      </Text>
                    </View>
                  </View>

                  {/* Batidas do dia */}
                  <View style={styles.dayPunchesPills}>
                    {summary.records.map((r) => {
                      const c = PONTO_TYPE_CONFIG[r.type];
                      return (
                        <TouchableOpacity
                          key={r.id}
                          style={[styles.pill, { borderColor: c.color }]}
                          onPress={() => onSelectRecord(r)}
                        >
                          <Text style={[styles.pillText, { color: c.color }]}>
                            {c.shortLabel}: {r.timeStr.substring(0, 5)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
  },
  tabContent: {
    marginTop: 4,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  recordsList: {
    gap: 10,
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  recordIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordDetails: {
    flex: 1,
  },
  recordRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  recordTime: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  recordLocation: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  viewReceiptLink: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  daySummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  daySummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  daySummaryDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  daySummaryPunches: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  daySummaryRight: {
    alignItems: 'flex-end',
  },
  daySummaryWorked: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  daySummaryBalance: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  dayPunchesPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F8FAFC',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
