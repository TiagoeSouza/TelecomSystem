// src/app/operadoras/operadora.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { generateGUID, Operadora } from '../../models/operadora.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OperadoraService {
    private operadoras: Operadora[] = [];
    private loaded = false;

    constructor(private http: HttpClient) { }

    private loadMock(): Observable<Operadora[]> {
        return this.http.get<Operadora[]>('assets/mocks/operadoras.json').pipe(
            tap(data => {
                this.operadoras = data;
                this.loaded = true;
            })
        );
    }

    getAll(): Observable<Operadora[]> {
        if (this.loaded) {
            return of([...this.operadoras]).pipe(delay(300));
        }
        return this.loadMock().pipe(delay(300));
    }

    getById(id: string): Observable<Operadora | undefined> {
        return of(this.operadoras.find(op => op.id === id)).pipe(delay(300));
    }

    add(data: Omit<Operadora, 'id'>): Observable<Operadora> {
        const nova = { id: generateGUID(), ...data };
        this.operadoras.push(nova);
        return of(nova).pipe(delay(300));
    }

    update(id: string, data: Omit<Operadora, 'id'>): Observable<Operadora | null> {
        const index = this.operadoras.findIndex(op => op.id === id);
        if (index > -1) {
            this.operadoras[index] = { id, ...data };
            return of(this.operadoras[index]).pipe(delay(300));
        }
        return of(null).pipe(delay(300));
    }

    delete(id: string): Observable<boolean> {
        this.operadoras = this.operadoras.filter(op => op.id !== id);
        return of(true).pipe(delay(300));
    }
}
