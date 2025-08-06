import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Activity, Database, Settings, LogOut, Plus, Gauge, TrendingUp } from 'lucide-react';
import AddDeviceForm from './AddDeviceForm';
import DeviceList from './DeviceList';
import WaterLevelGauge from './WaterLevelGauge';

interface User {
  id: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => Promise<void>;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center shadow-gold">
                  <Database className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">VistaData</h1>
                  <p className="text-sm text-muted-foreground">Sistema de Monitorização</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-primary text-primary">
                {user.email}
              </Badge>
              <Button 
                variant="professional" 
                size="sm" 
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="vista-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sensores Ativos</CardTitle>
                <Activity className="sensor-icon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-xs text-muted-foreground">+2 desde ontem</p>
              </CardContent>
            </Card>

            <Card className="vista-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dados Processados</CardTitle>
                <BarChart3 className="sensor-icon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-data-success">1,247</div>
                <p className="text-xs text-muted-foreground">+18% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card className="vista-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas</CardTitle>
                <Gauge className="sensor-icon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-data-warning">3</div>
                <p className="text-xs text-muted-foreground">2 críticos, 1 aviso</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <Card className="vista-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Painel de Controlo
              </CardTitle>
              <CardDescription>
                Gerencie seus sensores e monitore dados em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="devices" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Dispositivos
                  </TabsTrigger>
                  <TabsTrigger value="add" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Sensor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="devices" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Seus Sensores</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitore e gerencie todos os seus dispositivos
                      </p>
                    </div>
                    <Button 
                      variant="vista" 
                      onClick={() => setActiveTab('add')}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Novo Sensor
                    </Button>
                  </div>
                  
                  <DeviceList userId={user.id} onDeviceSelect={() => {}} />
                </TabsContent>

                <TabsContent value="add" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Adicionar Novo Sensor</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure um novo dispositivo para monitorização
                    </p>
                  </div>
                  
                  <AddDeviceForm 
                    userId={user.id} 
                    onDeviceAdded={() => setActiveTab('devices')} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Sample Data Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="vista-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Visualização de Dados
                </CardTitle>
                <CardDescription>Exemplo de monitorização em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <WaterLevelGauge level={75} lastUpdated={new Date()} />
              </CardContent>
            </Card>

            <Card className="vista-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Atualizações automáticas</span>
                  <Badge variant="outline" className="bg-data-success/10 text-data-success border-data-success">
                    Ativo
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notificações push</span>
                  <Badge variant="outline" className="bg-data-success/10 text-data-success border-data-success">
                    Habilitado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Armazenamento em nuvem</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                    Firebase
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;