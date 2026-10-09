# ⏰ Ponto Eletrônico Mobile (App de Ponto)

Aplicativo mobile moderno e completo para **Registro de Ponto Eletrônico** desenvolvido em **React Native**, **Expo** e **TypeScript**, projetado nos padrões de controle de jornada (inspirado na Portaria 671 do MTE).

---

## 📱 Funcionalidades Principais

- ⏱️ **Relógio Digital em Tempo Real**: Mostrador com precisão de segundos e atualização contínua.
- 🎯 **Registro Inteligente com 1 Clique**:
  - Sugestão automática do próximo registro com base na jornada do dia (*Entrada* ➡️ *Saída para Almoço* ➡️ *Retorno do Almoço* ➡️ *Saída de Expediente*).
  - Opção de registro manual de qualquer batida.
  - Inclusão opcional de observações/justificativas (*ex: Home Office, Visita a Cliente*).
- 📍 **Geolocalização**: Captura automática das coordenadas de latitude/longitude e endereço no momento da batida via `expo-location` (com fallback seguro offline).
- 📜 **Comprovante Digital de Ponto (NSR)**:
  - Emissão de ticket virtual com dados da empresa (CNPJ, Razão Social), dados do colaborador (CPF, Matrícula) e chave criptográfica única (Hash de autenticidade).
  - Opção para copiar o código de autenticação.
- 📊 **Espelho de Ponto & Saldo de Horas**:
  - Histórico de batidas agrupado por data.
  - Cálculo de horas trabalhadas por dia e balanço com a meta de jornada (ex: 8 horas diárias).
- 💾 **Persistência Local (Offline-First)**:
  - Armazenamento em dispositivo via `@react-native-async-storage/async-storage`.
  - Funciona totalmente offline.
- ⚙️ **Perfil e Configurações**:
  - Edição do nome, cargo, matrícula, CPF, empresa e jornada padrão.
  - Opção para gerar massa de dados de teste ou redefinir registros.

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)** (v0.86+)
- **[Expo](https://expo.dev/)** (SDK 57)
- **[TypeScript](https://www.typescriptlang.org/)**
- **[@expo/vector-icons](https://docs.expo.dev/guides/icons/)** (Ionicons)
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)**
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)**

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v20+)
- Aplicativo **Expo Go** instalado no seu celular ([Android na Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS na App Store](https://apps.apple.com/app/expo-go/id982107440)).

### 1. Clonar o repositório
```bash
git clone https://github.com/mrDantxs/app-ponto.git
cd app-ponto
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npx expo start
```

### 4. Rodar no dispositivo
- Abra a câmera do seu celular (iOS) ou o aplicativo **Expo Go** (Android) e escaneie o QR Code exibido no terminal.
- Para rodar na Web, pressione `w` no terminal.
- Para rodar em emulador Android, pressione `a`.

---

## 📂 Estrutura de Pastas

```
app-ponto/
├── assets/                  # Ícones e imagens do app
├── src/
│   ├── types/
│   │   └── ponto.ts         # Tipos e interfaces TypeScript
│   ├── services/
│   │   ├── storage.ts       # Camada de persistência AsyncStorage
│   │   ├── pontoService.ts  # Cálculos de jornada, hashes e regras de negócio
│   │   └── location.ts      # Serviço de geolocalização e geocoding
│   └── components/
│       ├── Header.tsx       # Barra de topo com perfil do colaborador
│       ├── ClockDisplay.tsx # Relógio digital e barra de progresso
│       ├── ActionButtons.tsx# Botões inteligentes de batida de ponto
│       ├── HistoryList.tsx  # Histórico do dia e espelho de ponto
│       ├── ReceiptModal.tsx # Comprovante digital de ponto (Portaria 671)
│       └── ProfileModal.tsx # Modal de configurações e perfil
├── App.tsx                  # Ponto de entrada da aplicação
├── app.json                 # Configuração do Expo e permissões
└── package.json             # Dependências e scripts
```

---

## 📄 Licença

Este projeto está sob a licença MIT.
