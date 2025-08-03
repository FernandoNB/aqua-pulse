import { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Mock authentication functions (replace with real Supabase integration)
  const handleAuth = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (email && password.length >= 6) {
        const mockUser = {
          id: `user_${Date.now()}`,
          email: email
        };
        
        setUser(mockUser);
        
        toast({
          title: isLogin ? "Login realizado com sucesso!" : "Conta criada com sucesso!",
          description: `Bem-vindo, ${email}`,
        });
      } else {
        throw new Error('Email e senha são obrigatórios. A senha deve ter pelo menos 6 caracteres.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro durante a autenticação');
      toast({
        title: "Erro na autenticação",
        description: err.message || 'Erro durante a autenticação',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao fazer logout",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    // In a real app, this would check for existing Supabase session
    const savedUser = localStorage.getItem('aqua-pulse-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('aqua-pulse-user');
      }
    }
  }, []);

  // Save user to localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('aqua-pulse-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aqua-pulse-user');
    }
  }, [user]);

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <AuthForm
      isLogin={isLogin}
      onToggleMode={() => setIsLogin(!isLogin)}
      onSubmit={handleAuth}
      error={error}
      loading={loading}
    />
  );
};

export default Index;
