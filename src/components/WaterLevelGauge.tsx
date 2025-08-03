import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface WaterLevelGaugeProps {
  level: number;
  lastUpdated?: Date | null;
  className?: string;
}

const WaterLevelGauge = ({ level, lastUpdated, className }: WaterLevelGaugeProps) => {
  const waterColor = useMemo(() => {
    if (level < 25) return 'water-low';
    if (level < 50) return 'water-medium';
    if (level < 75) return 'water-high';
    return 'water-full';
  }, [level]);

  const ripples = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      {/* Water Tank Container */}
      <div className="relative h-80 bg-card border-2 border-border rounded-xl overflow-hidden shadow-lg">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-surface opacity-50" />
        
        {/* Water Level */}
        <div 
          className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out animate-water-flow bg-gradient-water"
          style={{ 
            height: `${Math.max(level, 0)}%`,
            background: level < 25 ? 'hsl(var(--water-low))' :
                       level < 50 ? 'hsl(var(--water-medium))' :
                       level < 75 ? 'hsl(var(--water-high))' :
                       'hsl(var(--water-full))'
          }}
        >
          {/* Water surface ripples */}
          <div className="absolute top-0 left-0 w-full h-2 overflow-hidden">
            {ripples.map((_, index) => (
              <div
                key={index}
                className="absolute top-0 w-8 h-8 rounded-full border-2 border-white/30 animate-ripple"
                style={{
                  left: `${20 + index * 30}%`,
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
          
          {/* Water level percentage display */}
          {level > 15 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold drop-shadow-lg">
                {Math.round(level)}%
              </span>
            </div>
          )}
        </div>

        {/* Level indicators */}
        <div className="absolute right-2 top-2 bottom-2 w-1 bg-border/50 rounded-full">
          {[100, 75, 50, 25].map((mark) => (
            <div
              key={mark}
              className="absolute right-0 w-3 h-0.5 bg-muted-foreground/50"
              style={{ bottom: `${mark}%` }}
            >
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {mark}%
              </span>
            </div>
          ))}
        </div>

        {/* Empty state indicator */}
        {level <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">💧</div>
              <span className="text-muted-foreground">Tank vazio</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Info */}
      <div className="mt-4 text-center space-y-2">
        <div className="text-2xl font-bold text-foreground">
          Nível: {Math.round(level)}%
        </div>
        
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Última atualização: {lastUpdated.toLocaleString('pt-BR')}
          </p>
        )}
        
        {/* Status badge */}
        <div className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
          level < 25 && "bg-destructive/10 text-destructive",
          level >= 25 && level < 75 && "bg-yellow-500/10 text-yellow-600",
          level >= 75 && "bg-green-500/10 text-green-600"
        )}>
          {level < 25 && "⚠️ Nível Baixo"}
          {level >= 25 && level < 75 && "✓ Nível Normal"}
          {level >= 75 && "✅ Nível Alto"}
        </div>
      </div>
    </div>
  );
};

export default WaterLevelGauge;