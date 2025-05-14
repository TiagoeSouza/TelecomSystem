// src/app/operadoras/operadora.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { generateGUID, Operadora } from '../../models/operadora.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../ApiService';

@Injectable({ providedIn: 'root' })
export class OperadoraService {
    private operadoras: Operadora[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadMock(): Observable<Operadora[]> {
        // return this.http.get<Operadora[]>('assets/mocks/operadoras.json').pipe(
        //     tap(data => {
        //         this.operadoras = data;
        //         this.loaded = true;
        //     })
        // );
        return this.apiService.get<Operadora[]>('Operadoras').pipe(
            tap(data => {
                this.operadoras = data;
                this.loaded = true;
            })
        );

    }

    getAll(force = false): Observable<Operadora[]> {
        if (this.loaded && !force) {
            return of([...this.operadoras]);
        }
        return this.loadMock(); // que chama o backend
    }

    getById(id: string): Observable<Operadora | undefined> {
        const response = this.apiService.get<Operadora>(`Operadoras/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<Operadora, 'id'>): Observable<Operadora> {
        const nova = { id: generateGUID(), ...data };
        return this.apiService.post<Operadora>('Operadoras', nova);
    }


    update(id: string, data: Omit<Operadora, 'id'>): Observable<Operadora | null> {
        return this.apiService.put<Operadora>(`Operadoras/${id}`, data).pipe(
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Operadora não encontrada ao atualizar.');
                    return of(null);
                }
                console.error('Erro ao atualizar a operadora', error);
                throw error;
            })
        );
    }


    delete(id: string): Observable<boolean | null> {
        return this.apiService.delete(`Operadoras/${id}`).pipe(
            map(() => true),
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Operadora não encontrada ao excluir.');
                    return of(null); // null = não encontrada
                }

                console.error('Erro ao excluir a operadora', error);
                return of(false); // false = erro inesperado
            })
        );
    }
}
