'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (process.env.NODE_ENV !== 'production') {
      // Automatically unregister service worker in development mode to prevent chunk caching issues
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(async (registrations) => {
          let hasUnregistered = false;
          for (const registration of registrations) {
            const success = await registration.unregister();
            if (success) {
              console.log('Unregistered active service worker in development mode.');
              hasUnregistered = true;
            }
          }
          if (hasUnregistered) {
            // Force reload page to clear any network intercepts
            window.location.reload();
          }
        });
      }
      return;
    }

    if ('serviceWorker' in navigator) {
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
