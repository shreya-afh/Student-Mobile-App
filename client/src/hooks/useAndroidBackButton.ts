import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useAndroidBackButton(backPath: string) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    let handler: any;
    
    const setupListener = async () => {
      try {
        const { App } = await import(/* @vite-ignore */ '@capacitor/app');
        handler = await App.addListener('backButton', () => {
          setLocation(backPath);
        });
      } catch (error) {
        console.log('Capacitor App plugin not available:', error);
      }
    };

    setupListener();

    return () => {
      if (handler) {
        handler.remove();
      }
    };
  }, [backPath, setLocation]);
}
