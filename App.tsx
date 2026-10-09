import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { PontoRecord, PontoType, UserProfile } from './src/types/ponto';
import {
  loadRecordsFromStorage,
  saveRecordsToStorage,
  loadProfileFromStorage,
  saveProfileToStorage,
  clearAllPontoData,
  defaultProfile,
} from './src/services/storage';
import {
  generatePontoHash,
  formatDateToIso,
  formatTimeToIso,
  PONTO_TYPE_CONFIG,
} from './src/services/pontoService';
import { getCurrentUserLocation } from './src/services/location';

import { Header } from './src/components/Header';
import { ClockDisplay } from './src/components/ClockDisplay';
import { ActionButtons } from './src/components/ActionButtons';
import { HistoryList } from './src/components/HistoryList';
import { ReceiptModal } from './src/components/ReceiptModal';
import { ProfileModal } from './src/components/ProfileModal';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [records, setRecords] = useState<PontoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PontoRecord | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Carregar dados salvos no início
  useEffect(() => {
    async function init() {
      const storedProfile = await loadProfileFromStorage();
      const storedRecords = await loadRecordsFromStorage();
      setProfile(storedProfile);

      if (storedRecords.length === 0) {
        // Gerar alguns registros de demonstração iniciais para experiência imediata
        const initialMock = createInitialDemoRecords(storedProfile.matricula);
        setRecords(initialMock);
        await saveRecordsToStorage(initialMock);
      } else {
        setRecords(storedRecords);
      }
    }
    init();
  }, []);

  const todayStr = formatDateToIso(new Date());
  const todayRecords = records.filter((r) => r.dateStr === todayStr);

  const handleRegisterPonto = async (type: PontoType, notes?: string) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const timestamp = now.getTime();
      const location = await getCurrentUserLocation();
      const hashAuth = generatePontoHash(timestamp, profile.matricula);

      const newRecord: PontoRecord = {
        id: `ponto_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp,
        type,
        dateStr: formatDateToIso(now),
        timeStr: formatTimeToIso(now),
        location,
        notes,
        hashAuth,
        synced: true,
      };

      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      await saveRecordsToStorage(updatedRecords);

      // Exibe imediatamente o comprovante do ponto acabado de bater
      setSelectedReceipt(newRecord);
    } catch (error) {
      console.error('Falha ao bater ponto:', error);
      Alert.alert('Erro', 'Não foi possível registrar o ponto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    setProfile(updated);
    await saveProfileToStorage(updated);
  };

  const handleResetData = async () => {
    await clearAllPontoData();
    setRecords([]);
  };

  const handleGenerateMockData = async () => {
    const mock = createInitialDemoRecords(profile.matricula);
    setRecords(mock);
    await saveRecordsToStorage(mock);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header profile={profile} onOpenProfile={() => setShowProfileModal(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ClockDisplay
          todayRecords={todayRecords}
          dailyGoalHours={profile.dailyHoursGoal}
        />

        <ActionButtons
          todayRecords={todayRecords}
          onRegisterPonto={handleRegisterPonto}
          isLoading={isLoading}
        />

        <HistoryList
          records={records}
          dailyGoalHours={profile.dailyHoursGoal}
          onSelectRecord={(rec) => setSelectedReceipt(rec)}
        />
      </ScrollView>

      {/* Modal de Comprovante de Ponto */}
      <ReceiptModal
        record={selectedReceipt}
        profile={profile}
        visible={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Modal de Perfil e Configurações */}
      <ProfileModal
        profile={profile}
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSaveProfile={handleSaveProfile}
        onResetData={handleResetData}
        onGenerateMockData={handleGenerateMockData}
      />
    </SafeAreaView>
  );
}

function createInitialDemoRecords(matricula: string): PontoRecord[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDateStr = formatDateToIso(yesterday);

  const mockLocation = {
    latitude: -23.55052,
    longitude: -46.633308,
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  };

  // Dia anterior completo (8h de trabalho)
  const y1Time = new Date(yesterday.setHours(9, 0, 12, 0)).getTime();
  const y2Time = new Date(yesterday.setHours(12, 0, 45, 0)).getTime();
  const y3Time = new Date(yesterday.setHours(13, 0, 22, 0)).getTime();
  const y4Time = new Date(yesterday.setHours(18, 2, 5, 0)).getTime();

  return [
    {
      id: 'demo_y4',
      timestamp: y4Time,
      type: 'saida',
      dateStr: yDateStr,
      timeStr: '18:02:05',
      location: mockLocation,
      hashAuth: generatePontoHash(y4Time, matricula),
      synced: true,
    },
    {
      id: 'demo_y3',
      timestamp: y3Time,
      type: 'almoco_retorno',
      dateStr: yDateStr,
      timeStr: '13:00:22',
      location: mockLocation,
      hashAuth: generatePontoHash(y3Time, matricula),
      synced: true,
    },
    {
      id: 'demo_y2',
      timestamp: y2Time,
      type: 'almoco_saida',
      dateStr: yDateStr,
      timeStr: '12:00:45',
      location: mockLocation,
      hashAuth: generatePontoHash(y2Time, matricula),
      synced: true,
    },
    {
      id: 'demo_y1',
      timestamp: y1Time,
      type: 'entrada',
      dateStr: yDateStr,
      timeStr: '09:00:12',
      location: mockLocation,
      hashAuth: generatePontoHash(y1Time, matricula),
      synced: true,
    },
  ];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
