import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { SensorDevice } from '@/lib/firebase';

interface DeviceListProps {
  userId: string;
  onDeviceSelect: (device: SensorDevice) => void;
  selectedDeviceId?: string;
}

const DeviceList = ({ userId, onDeviceSelect, selectedDeviceId }: DeviceListProps) => {
  const [devices, setDevices] = useState<SensorDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'sensors'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceList: SensorDevice[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        deviceList.push({
          id: doc.id,
          userId: data.userId,
          sensorId: data.sensorId,
          name: data.name,
          location: data.location,
          type: data.type,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastReading: data.lastReading,
          lastUpdated: data.lastUpdated?.toDate()
        });
      });

      setDevices(deviceList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar dispositivos:', error);
      toast({
        title: "Erro ao carregar dispositivos",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, toast]);

  const handleDelete = async (deviceId: string, deviceName: string) => {
    if (!confirm(`Tem certeza que deseja remover o sensor "${deviceName}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'sensors', deviceId));
      toast({
        title: "Sensor removido",
        description: `"${deviceName}" foi removido com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'water-level': return '💧';
      case 'temperature': return '🌡️';
      case 'pressure': return '📊';
      case 'flow': return '🌊';
      case 'ph': return '⚗️';
      default: return '🔧';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'water-level': return 'Nível de Água';
      case 'temperature': return 'Temperatura';
      case 'pressure': return 'Pressão';
      case 'flow': return 'Fluxo';
      case 'ph': return 'pH';
      default: return 'Outro';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Carregando dispositivos...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">📱</div>
            <p className="text-muted-foreground">
              Nenhum sensor cadastrado ainda
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Adicionar Novo Sensor" para começar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <Card 
          key={device.id}
          className={`h-full cursor-pointer transition-all hover:shadow-lg ${
            selectedDeviceId === device.id 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:bg-accent/50'
          }`}
          onClick={() => onDeviceSelect(device)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {getTypeIcon(device.type)} {device.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={device.isActive ? "default" : "secondary"}>
                  {device.isActive ? '🟢 Ativo' : '🔴 Inativo'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(device.id, device.name);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  🗑️
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID do Sensor:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {device.sensorId}
                </code>
              </div>
              
              {device.location && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Localização:</span>
                  <span>{device.location}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span>{getTypeLabel(device.type)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cadastrado em:</span>
                <span>{device.createdAt.toLocaleDateString('pt-BR')}</span>
              </div>
              
              {device.lastReading !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última leitura:</span>
                  <span className="font-medium">{device.lastReading}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeviceList;