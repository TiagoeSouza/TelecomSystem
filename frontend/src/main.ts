/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/services/auth.interceptor';
import { provideNgxMask } from 'ngx-mask';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [appRoutes, provideAnimations(), provideToastr({
    positionClass: 'toast-top-right',
    timeOut: 3000,
    closeButton: true,
    progressBar: true
  }),
    provideNgxMask(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
})
  .catch((err) => console.error(err));
