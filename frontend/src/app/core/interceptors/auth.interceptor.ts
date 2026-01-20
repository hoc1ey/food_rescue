import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Solo ejecutamos lógica de token en el navegador
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('auth_token'); // <-- Corregido para coincidir con AuthService

    // 🔍 DEBUG: Descomenta esto para ver en la consola si el interceptor corre
    console.log(`[Interceptor] URL: ${req.url} | Token encontrado: ${!!token}`);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
  }

  return next(req);
};
