import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Home, ServerCrash } from 'lucide-react';

interface ErrorPageProps {
  code: number;
  title: string;
  description: string;
  showGoBack?: boolean;
  showGoHome?: boolean;
}

export default function ErrorPage({ code, title, description, showGoBack = true, showGoHome = true }: ErrorPageProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Выбираем иконку в зависимости от типа ошибки
  const getIcon = () => {
    if (code >= 500) {
      return <ServerCrash className='w-8 h-8 text-destructive' />;
    }
    return <AlertTriangle className='w-8 h-8 text-destructive' />;
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <Card className='text-center shadow-lg'>
          <CardHeader className='pb-4'>
            <div className='mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center'>
              {getIcon()}
            </div>
            <CardTitle className='text-2xl font-bold text-foreground'>{code}</CardTitle>
            <CardDescription className='text-lg'>{title}</CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>{description}</p>

            <div className='space-y-2'>
              {showGoHome && (
                <Button onClick={handleGoHome} className='w-full' size='lg'>
                  <Home className='mr-2 h-4 w-4' />
                  Go Home
                </Button>
              )}

              {showGoBack && (
                <Button onClick={handleGoBack} variant='outline' className='w-full' size='lg'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Go Back
                </Button>
              )}
            </div>

            <div className='pt-4 border-t border-border'>
              <p className='text-sm text-muted-foreground'>If the problem persists, please contact support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
