import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PontoType, PontoRecord } from '../types/ponto';
import { PONTO_TYPE_CONFIG, getSuggestedNextType } from '../services/pontoService';

interface ActionButtonsProps {
  todayRecords: PontoRecord[];
  onRegisterPonto: (type: PontoType, notes?: string) => Promise<void>;
  isLoading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  todayRecords,
  onRegisterPonto,
  isLoading,
}) => {
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const suggestedType = getSuggestedNextType(todayRecords);
  const suggestedConfig = PONTO_TYPE_CONFIG[suggestedType];

  const handleQuickRegister = async () => {
    await onRegisterPonto(suggestedType, notes.trim() || undefined);
    setNotes('');
    setShowNotesInput(false);
  };

  const handleTypeSelect = async (type: PontoType) => {
    await onRegisterPonto(type, notes.trim() || undefined);
    setNotes('');
    setShowNotesInput(false);
  };

  return (
    <View style={styles.container}>
      {/* Botão de Registro Principal Sugerido */}
      <TouchableOpacity
        style={[styles.mainButton, { backgroundColor: suggestedConfig.color }]}
        onPress={handleQuickRegister}
        disabled={isLoading}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Bater ponto sugerido: ${suggestedConfig.label}`}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.mainButtonContent}>
            <Ionicons
              name={suggestedConfig.icon as any}
              size={28}
              color="#FFFFFF"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={styles.mainButtonSubtext}>Registro Recomendado</Text>
              <Text style={styles.mainButtonText}>{suggestedConfig.label}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Toggle Observação */}
      <TouchableOpacity
        style={styles.toggleNotesBtn}
        onPress={() => setShowNotesInput(!showNotesInput)}
      >
        <Ionicons
          name={showNotesInput ? 'chevron-up-outline' : 'chatbubble-ellipses-outline'}
          size={16}
          color="#3B82F6"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.toggleNotesText}>
          {showNotesInput ? 'Ocultar observação' : 'Adicionar observação (ex: Home Office)'}
        </Text>
      </TouchableOpacity>

      {showNotesInput && (
        <View style={styles.notesContainer}>
          <TextInput
            style={styles.notesInput}
            placeholder="Ex: Trabalho externo, esquecimento, etc."
            placeholderTextColor="#94A3B8"
            value={notes}
            onChangeText={setNotes}
            maxLength={100}
          />
        </View>
      )}

      {/* Grid de outras opções manuais */}
      <Text style={styles.manualSectionTitle}>Ou selecione o tipo de registro:</Text>
      <View style={styles.grid}>
        {(['entrada', 'almoco_saida', 'almoco_retorno', 'saida'] as PontoType[]).map((type) => {
          const config = PONTO_TYPE_CONFIG[type];
          const isSuggested = type === suggestedType;

          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.gridButton,
                isSuggested && { borderColor: config.color, borderWidth: 1.5 },
              ]}
              onPress={() => handleTypeSelect(type)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: config.badgeBg }]}>
                <Ionicons name={config.icon as any} size={18} color={config.color} />
              </View>
              <Text style={styles.gridButtonText}>{config.shortLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  mainButton: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  mainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  toggleNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 4,
  },
  toggleNotesText: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  manualSectionTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  gridIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
});
