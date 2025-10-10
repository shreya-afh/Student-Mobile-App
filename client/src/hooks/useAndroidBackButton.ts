import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useLocation } from 'wouter';

export function useAndroidBackButton(backPath: string) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handler = App.addListener('backButton', () => {
      setLocation(backPath);
    });

    return () => {
      handler.then(h => h.remove());
    };
  }, [backPath, setLocation]);
}
