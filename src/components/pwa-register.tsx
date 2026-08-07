'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration) {
          navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
              console.log('Service Worker registered successfully with scope:', reg.scope);
            })
            .catch((err) => {
              console.error('Service Worker registration failed:', err);
            });
        }
      });
    }
  }, []);

  return null;
}
