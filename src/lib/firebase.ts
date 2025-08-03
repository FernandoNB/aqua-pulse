import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ CONFIGURAÇÃO NECESSÁRIA - substitua pelos valores do seu projeto Firebase
// Para obter essas informações:
// 1. Acesse https://console.firebase.google.com
// 2. Selecione seu projeto
// 3. Vá em "Configurações do projeto" > "Geral"
// 4. Na seção "Seus apps", copie a configuração
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com", 
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};

// Inicializar Firebase apenas uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface SensorDevice {
  id: string;
  userId: string;
  sensorId: string;
  name: string;
  location?: string;
  type: string;
  isActive: boolean;
  createdAt: Date;
  lastReading?: number;
  lastUpdated?: Date;
}

export default app;