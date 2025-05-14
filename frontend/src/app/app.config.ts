import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideToastr } from 'ngx-toastr'; // Import provideToastr from ngx-toastr
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), appRoutes, provideClientHydration(withEventReplay()),
    // provideAnimations(),
    // provideToastr({
    //   positionClass: 'toast-top-right',
    //   timeOut: 3000,        // (opcional) duração do toast
    //   closeButton: true,    // (opcional) botão para fechar
    //   progressBar: true     // (opcional) barra de progresso
    // })
  ]
};
