import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PontoRecord, UserProfile } from '../types/ponto';
import { PONTO_TYPE_CONFIG } from '../services/pontoService';

interface ReceiptModalProps {
  record: PontoRecord | null;
  profile: UserProfile;
  visible: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  record,
  profile,
  visible,
  onClose,
}) => {
  if (!record) return null;

  const typeConfig = PONTO_TYPE_CONFIG[record.type];

  const handleCopyCode = () => {
    Alert.alert(
      'Código de Autenticidade',
      `Hash/NSR:\n${record.hashAuth}\n\nComprovante autenticado digitalmente nos moldes da Portaria 671 MTE.`
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header do Modal */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="document-text-outline" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Comprovante de Ponto</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Ticket Header */}
            <View style={styles.ticketCard}>
              <View style={styles.stampHeader}>
                <Text style={styles.companyTitle}>{profile.empresa}</Text>
                <Text style={styles.companyCnpj}>CNPJ: {profile.cnpj}</Text>
                <Text style={styles.portariaLabel}>Portaria 671 MTE • Registro Eletrônico</Text>
              </View>

              <View style={styles.divider} />

              {/* Tipo e Horário em destaque */}
              <View style={styles.highlightSection}>
                <View style={[styles.typeBadge, { backgroundColor: typeConfig.badgeBg }]}>
                  <Text style={[styles.typeBadgeText, { color: typeConfig.color }]}>
                    {typeConfig.label.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.timeBig}>{record.timeStr}</Text>
                <Text style={styles.dateLabel}>{record.dateStr.split('-').reverse().join('/')}</Text>
              </View>

              <View style={styles.divider} />

              {/* Dados do Colaborador */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Colaborador(a):</Text>
                <Text style={styles.infoValue}>{profile.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CPF:</Text>
                <Text style={styles.infoValue}>{profile.cpf}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Matrícula:</Text>
                <Text style={styles.infoValue}>{profile.matricula}</Text>
              </View>

              {/* Localização */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Localização:</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {record.location?.address || 'Localização Registrada'}
                </Text>
              </View>

              {record.notes && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Observação:</Text>
                  <Text style={styles.infoValue}>{record.notes}</Text>
                </View>
              )}

              <View style={styles.divider} />

              {/* Autenticação & Hash */}
              <View style={styles.authContainer}>
                <Text style={styles.authTitle}>CHAVE DE AUTENTICIDADE DIGITAL (NSR)</Text>
                <Text style={styles.authCode}>{record.hashAuth}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Rodapé com botões */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
              <Ionicons name="copy-outline" size={18} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text style={styles.copyBtnText}>Copiar Hash / NSR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.okBtn} onPress={onClose}>
              <Text style={styles.okBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
  },
  ticketCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
  },
  stampHeader: {
    alignItems: 'center',
  },
  companyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  companyCnpj: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  portariaLabel: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  highlightSection: {
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timeBig: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  dateLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    width: 100,
  },
  infoValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  authContainer: {
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  authCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
  },
  copyBtnText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 13,
  },
  okBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 12,
  },
  okBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
