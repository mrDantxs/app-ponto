import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../types/ponto';

interface ProfileModalProps {
  profile: UserProfile;
  visible: boolean;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => Promise<void>;
  onResetData: () => Promise<void>;
  onGenerateMockData: () => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  visible,
  onClose,
  onSaveProfile,
  onResetData,
  onGenerateMockData,
}) => {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [matricula, setMatricula] = useState(profile.matricula);
  const [cpf, setCpf] = useState(profile.cpf);
  const [empresa, setEmpresa] = useState(profile.empresa);
  const [cnpj, setCnpj] = useState(profile.cnpj);
  const [dailyHoursGoal, setDailyHoursGoal] = useState(String(profile.dailyHoursGoal));

  const handleSave = async () => {
    const goalNumber = parseFloat(dailyHoursGoal) || 8;
    await onSaveProfile({
      name,
      role,
      matricula,
      cpf,
      empresa,
      cnpj,
      dailyHoursGoal: goalNumber,
    });
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    onClose();
  };

  const confirmReset = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todos os registros de ponto do aparelho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await onResetData();
            Alert.alert('Pronto', 'Histórico de pontos limpo.');
            onClose();
          },
        },
      ]
    );
  };

  const handleGenerateSample = async () => {
    await onGenerateMockData();
    Alert.alert('Sucesso', 'Dados de demonstração gerados com sucesso!');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="person-circle-outline" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Perfil & Configurações</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Dados do Colaborador</Text>
            
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Cargo / Função</Text>
            <TextInput style={styles.input} value={role} onChangeText={setRole} />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Matrícula</Text>
                <TextInput style={styles.input} value={matricula} onChangeText={setMatricula} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>CPF</Text>
                <TextInput style={styles.input} value={cpf} onChangeText={setCpf} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Dados da Empresa</Text>

            <Text style={styles.label}>Razão Social / Nome Fantasia</Text>
            <TextInput style={styles.input} value={empresa} onChangeText={setEmpresa} />

            <View style={styles.row}>
              <View style={{ flex: 1.3, marginRight: 8 }}>
                <Text style={styles.label}>CNPJ</Text>
                <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} />
              </View>
              <View style={{ flex: 0.9 }}>
                <Text style={styles.label}>Jornada Diária (h)</Text>
                <TextInput
                  style={styles.input}
                  value={dailyHoursGoal}
                  onChangeText={setDailyHoursGoal}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Ações de Dados</Text>

            <TouchableOpacity style={styles.mockButton} onPress={handleGenerateSample}>
              <Ionicons name="sparkles-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.mockButtonText}>Gerar Histórico de Demonstração</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerButton} onPress={confirmReset}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.dangerButtonText}>Limpar Todos os Registros</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Salvar Alterações</Text>
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
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  mockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  mockButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  saveBtn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
