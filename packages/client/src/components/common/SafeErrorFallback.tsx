import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft, RotateCcw } from 'lucide-react';

export const SafeErrorFallback = () => {
  const goHome = () => {
    window.location.assign('/');
  };
  const goBack = () => {
    window.history.back();
  };
  const reload = () => {
    window.location.reload();
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <Card className='text-center shadow-lg'>
          <CardHeader className='pb-4'>
            <div className='mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center'>
              <AlertTriangle className='w-8 h-8 text-destructive' />
            </div>
            <CardTitle className='text-2xl font-bold text-foreground'>500</CardTitle>
            <CardDescription className='text-lg'>Unexpected Error</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>Something went wrong.</p>
            <div className='space-y-2'>
              <Button onClick={goHome} className='w-full' size='lg'>
                <Home className='mr-2 h-4 w-4' />
                Go Home
              </Button>
              <Button onClick={goBack} variant='outline' className='w-full' size='lg'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Go Back
              </Button>
              <Button onClick={reload} variant='secondary' className='w-full' size='lg'>
                <RotateCcw className='mr-2 h-4 w-4' />
                Reload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
