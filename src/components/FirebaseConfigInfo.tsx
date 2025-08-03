import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FirebaseConfigInfo = () => {
  return (
    <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-800 dark:text-orange-200">
          🔧 Configuração Necessária
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            Firebase
          </Badge>
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          Para usar autenticação e armazenamento de dados, configure suas credenciais do Firebase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-orange-800 dark:text-orange-200">
          <p className="font-medium mb-2">📋 Passos para configurar:</p>
          <ol className="list-decimal list-inside space-y-1 text-orange-700 dark:text-orange-300">
            <li>Acesse <a href="https://console.firebase.google.com" target="_blank" className="underline hover:text-orange-600">console.firebase.google.com</a></li>
            <li>Crie um novo projeto ou selecione um existente</li>
            <li>Vá em "Configurações do projeto" → "Geral"</li>
            <li>Na seção "Seus apps", adicione um app web</li>
            <li>Copie a configuração e substitua no arquivo <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">src/lib/firebase.ts</code></li>
            <li>Ative Authentication (email/senha) e Firestore no console</li>
          </ol>
        </div>
        
        <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <p className="text-xs text-orange-600 dark:text-orange-400">
            💡 <strong>Dica:</strong> Após configurar, os dados serão salvos automaticamente no Firestore 
            vinculados ao UID do usuário autenticado
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseConfigInfo;