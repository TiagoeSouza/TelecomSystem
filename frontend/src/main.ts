/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [appRoutes, provideAnimations(), provideToastr({
    positionClass: 'toast-top-right',
    timeOut: 3000,
    closeButton: true,
    progressBar: true
  }),
    provideHttpClient(),
  ],
})
  .catch((err) => console.error(err));
