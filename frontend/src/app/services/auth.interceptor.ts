import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
    console.log('Interceptando requisição', req, token);


    return next(authReq).pipe(
        tap({
            error: (err) => {
                if (err.status === 401 && !req.url.includes('/UserAuth/login')) {
                    console.error('Erro na requisição', err);
                    router.navigate(['/login']);
                }
            }
        }),
        catchError(err => {
            // propaga o erro para os subscribers
            return throwError(() => err);
        })
    );
};
