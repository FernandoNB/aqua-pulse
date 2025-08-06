import { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { SensorDevice } from '@/lib/firebase';

interface AddDeviceFormProps {
  userId: string;
  onDeviceAdded: (device: SensorDevice) => void;
}

const AddDeviceForm = ({ userId, onDeviceAdded }: AddDeviceFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sensorId: '',
    name: '',
    location: '',
    type: 'water-level'
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sensorId || !formData.name) {
      toast({
        title: "Campos obrigatórios",
        description: "ID do sensor e nome são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const deviceData = {
        userId,
        sensorId: formData.sensorId,
        name: formData.name,
        location: formData.location,
        type: formData.type,
        isActive: true,
        createdAt: new Date(),
        lastReading: 0
      };

      const docRef = await addDoc(collection(db, 'sensors'), deviceData);
      
      const newDevice: SensorDevice = {
        id: docRef.id,
        ...deviceData
      };

      onDeviceAdded(newDevice);
      
      toast({
        title: "Sensor cadastrado!",
        description: `Sensor "${formData.name}" foi adicionado com sucesso`,
      });

      // Reset form and close dialog
      setFormData({
        sensorId: '',
        name: '',
        location: '',
        type: 'water-level'
      });
      setOpen(false);

    } catch (error: any) {
      console.error('Erro ao cadastrar sensor:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível cadastrar o sensor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="vista" size="lg">
          📱 Adicionar Novo Sensor
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔧 Cadastrar Novo Sensor
          </DialogTitle>
          <DialogDescription>
            Adicione um novo sensor/dispositivo para monitoramento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sensorId" className="text-sm font-medium">
              ID do Sensor *
            </Label>
            <Input
              id="sensorId"
              placeholder="Ex: SENSOR_001, ESP32_ABC123"
              value={formData.sensorId}
              onChange={(e) => setFormData({ ...formData, sensorId: e.target.value })}
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">
              Identificador único do seu dispositivo/sensor
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome do Sensor *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Caixa d'água principal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Localização
            </Label>
            <Input
              id="location"
              placeholder="Ex: Terraço, Quintal, Subsolo"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Tipo do Sensor
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water-level">💧 Nível de Água</SelectItem>
                <SelectItem value="temperature">🌡️ Temperatura</SelectItem>
                <SelectItem value="pressure">📊 Pressão</SelectItem>
                <SelectItem value="flow">🌊 Fluxo</SelectItem>
                <SelectItem value="ph">⚗️ pH</SelectItem>
                <SelectItem value="other">🔧 Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="professional"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceForm;