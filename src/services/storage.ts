import AsyncStorage from '@react-native-async-storage/async-storage';
import { PontoRecord, UserProfile } from '../types/ponto';

const STORAGE_KEYS = {
  RECORDS: '@app_ponto_records',
  PROFILE: '@app_ponto_profile',
};

export const defaultProfile: UserProfile = {
  name: 'Colaborador',
  role: 'Desenvolvedor(a)',
  cpf: '***.456.789-**',
  matricula: 'BR-2026-091',
  empresa: 'Tech Inovações Ltda',
  cnpj: '12.345.678/0001-90',
  dailyHoursGoal: 8,
};

export async function loadRecordsFromStorage(): Promise<PontoRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao carregar registros do storage:', error);
    return [];
  }
}

export async function saveRecordsToStorage(records: PontoRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Erro ao salvar registros no storage:', error);
  }
}

export async function loadProfileFromStorage(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return defaultProfile;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao carregar perfil do storage:', error);
    return defaultProfile;
  }
}

export async function saveProfileToStorage(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Erro ao salvar perfil no storage:', error);
  }
}

export async function clearAllPontoData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.RECORDS);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
}
