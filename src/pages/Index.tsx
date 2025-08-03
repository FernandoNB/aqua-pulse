import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Real Firebase authentication functions
  const handleAuth = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      let userCredential;
      
      if (isLogin) {
        // Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Register
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const firebaseUser = userCredential.user;
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email
      };
      
      setUser(userData);
      
      toast({
        title: isLogin ? "Login realizado com sucesso!" : "Conta criada com sucesso!",
        description: `Bem-vindo, ${firebaseUser.email}`,
      });

    } catch (err: any) {
      let errorMessage = 'Erro durante a autenticação';
      
      // Firebase error messages in Portuguese
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase não configurado. Configure suas credenciais no arquivo firebase.ts';
          break;
        default:
          errorMessage = err.message || 'Erro durante a autenticação';
      }
      
      setError(errorMessage);
      toast({
        title: "Erro na autenticação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || ''
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setInitialLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking authentication
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center shadow-lg animate-float mx-auto mb-4">
            <span className="text-2xl">💧</span>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

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
