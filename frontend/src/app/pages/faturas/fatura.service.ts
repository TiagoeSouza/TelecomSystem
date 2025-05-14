import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Fatura } from '../../models/fatura.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FaturaService {
    private faturas: Fatura[] = [];
    private loaded = false;

    constructor(private http: HttpClient) { }

    private loadMock(): Observable<Fatura[]> {
        return this.http.get<Fatura[]>('assets/mocks/faturas.json').pipe(
            tap(data => {
                this.faturas = data;
                this.loaded = true;
            })
        );
    }


    getAll(): Observable<Fatura[]> {
        if (this.loaded) {
            return of([...this.faturas]).pipe(delay(300));
        }
        return this.loadMock().pipe(delay(300));
    }
}
