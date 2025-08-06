import { cn } from '@/lib/utils';
import { Droplets, TrendingUp, Clock } from 'lucide-react';

interface WaterLevelGaugeProps {
  level: number;
  lastUpdated?: Date | null;
  className?: string;
}

const WaterLevelGauge = ({ level, lastUpdated, className }: WaterLevelGaugeProps) => {
  const getStatusColor = (level: number) => {
    if (level < 25) return 'text-data-error';
    if (level < 50) return 'text-data-warning';
    if (level < 75) return 'text-data-primary';
    return 'text-data-success';
  };

  const getStatusLabel = (level: number) => {
    if (level < 25) return 'Crítico';
    if (level < 50) return 'Baixo';
    if (level < 75) return 'Normal';
    return 'Ótimo';
  };

  const getBgGradient = (level: number) => {
    if (level < 25) return 'from-data-error/20 to-data-error/10';
    if (level < 50) return 'from-data-warning/20 to-data-warning/10';
    if (level < 75) return 'from-data-primary/20 to-data-primary/10';
    return 'from-data-success/20 to-data-success/10';
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="space-y-6">
        {/* Modern Tank Visualization */}
        <div className="relative">
          <div className="water-tank h-64 w-32 mx-auto bg-gradient-to-b from-muted/30 to-muted">
            {/* Water fill with modern gradient */}
            <div 
              className="water-fill bg-gradient-water rounded-b-lg"
              style={{ height: `${level}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-data-primary/30 to-transparent animate-water-flow" />
            </div>
            
            {/* Tank indicators */}
            <div className="absolute inset-y-0 -right-8 flex flex-col justify-between text-xs text-muted-foreground py-2">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            
            {/* Current level indicator */}
            <div 
              className="absolute -left-4 w-6 h-0.5 bg-primary shadow-gold transform -translate-y-1/2"
              style={{ top: `${100 - level}%` }}
            >
              <div className="absolute -left-8 -top-2 text-xs font-medium text-primary">
                {level}%
              </div>
            </div>
          </div>
        </div>

        {/* Status and Metrics */}
        <div className="space-y-4">
          {/* Current Status */}
          <div className={cn("text-center p-4 rounded-lg bg-gradient-to-r", getBgGradient(level))}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Droplets className={cn("w-5 h-5", getStatusColor(level))} />
              <span className={cn("font-semibold", getStatusColor(level))}>
                Status: {getStatusLabel(level)}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {level}% de capacidade
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Tendência</span>
              </div>
              <div className="font-medium text-sm text-primary">
                {level > 50 ? '↗ Subindo' : '↘ Descendo'}
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Última</span>
              </div>
              <div className="font-medium text-sm">
                {lastUpdated ? (
                  <span>
                    {lastUpdated.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">--:--</span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar Alternative */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Capacidade</span>
              <span className="font-medium">{level}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-water transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${level}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Vazio</span>
              <span>Cheio</span>
            </div>
          </div>

          {/* Last Update Info */}
          {lastUpdated && (
            <div className="text-center text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              Última atualização: {lastUpdated.toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterLevelGauge;