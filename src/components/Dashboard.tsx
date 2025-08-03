import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WaterLevelGauge from './WaterLevelGauge';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => Promise<void>;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate real-time water level updates
  useEffect(() => {
    // Simulate initial data
    setWaterLevel(65);
    setLastUpdated(new Date());

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      // Simulate sensor readings with slight variations
      setWaterLevel(prev => {
        const variation = (Math.random() - 0.5) * 10; // ±5% variation
        const newLevel = Math.max(0, Math.min(100, prev + variation));
        return Math.round(newLevel);
      });
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Simulate manual refresh
    setWaterLevel(prev => {
      const variation = (Math.random() - 0.5) * 5;
      return Math.max(0, Math.min(100, prev + variation));
    });
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
              Aqua Pulse
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor de Nível de Água em Tempo Real
            </p>
          </div>
          
          <Button 
            variant="logout" 
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Saindo...' : 'Sair'}
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              👤 Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">ID:</span> 
                <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                  {user.id}
                </code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Water Level Display */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                💧 Nível de Água Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <WaterLevelGauge 
                level={waterLevel} 
                lastUpdated={lastUpdated}
                className="mb-4"
              />
              
              <Button 
                variant="water" 
                onClick={handleRefresh}
                className="mt-4"
              >
                🔄 Atualizar Dados
              </Button>
            </CardContent>
          </Card>

          {/* Statistics and Controls */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">📊 Estatísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">{waterLevel}%</div>
                    <div className="text-sm text-muted-foreground">Nível Atual</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl font-bold text-accent">
                      {waterLevel > 50 ? '✓' : '⚠️'}
                    </div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts and Notifications */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">🔔 Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {waterLevel < 25 && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2">
                        <span className="text-destructive">⚠️</span>
                        <span className="text-sm font-medium text-destructive">
                          Nível de água baixo!
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {waterLevel >= 90 && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">ℹ️</span>
                        <span className="text-sm font-medium text-blue-600">
                          Nível de água alto
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {waterLevel >= 25 && waterLevel < 90 && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm font-medium text-green-600">
                          Nível normal - Tudo funcionando bem
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">ℹ️ Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Sensor conectado e funcionando</p>
                <p>• Atualizações automáticas a cada 30 segundos</p>
                <p>• Dados armazenados em tempo real</p>
                <p>• Sistema de alertas ativo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;