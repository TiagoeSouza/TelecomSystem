// src/app/operadoras/operadora.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { IOperadora } from '../models/operadora.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';

@Injectable({ providedIn: 'root' })
export class OperadoraService {
    private operadoras: IOperadora[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadMock(): Observable<IOperadora[]> {
        // return this.http.get<Operadora[]>('assets/mocks/operadoras.json').pipe(
        //     tap(data => {
        //         this.operadoras = data;
        //         this.loaded = true;
        //     })
        // );
        return this.apiService.get<IOperadora[]>('Operadoras').pipe(
            tap(data => {
                this.operadoras = data;
                this.loaded = true;
            })
        );

    }

    getAll(force = false): Observable<IOperadora[]> {
        if (this.loaded && !force) {
            return of([...this.operadoras]);
        }
        return this.loadMock(); // que chama o backend
    }

    getById(id: string): Observable<IOperadora | undefined> {
        const response = this.apiService.get<IOperadora>(`Operadoras/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<IOperadora, 'id'>): Observable<IOperadora> {
        const nova = {
            ...data,
            id: generateGUID()
        };
        console.log('nova', nova);
        return this.apiService.post<IOperadora>('Operadoras', nova);
    }


    update(id: string, data: Omit<IOperadora, 'id'>): Observable<IOperadora | null> {
        return this.apiService.put<IOperadora>(`Operadoras/${id}`, data).pipe(
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
                if (error.status === 400) {
                    const mensagem =
                        typeof error.error === 'string'
                            ? error.error
                            : error.error?.message || 'Erro ao excluir: dados relacionados.';
                    throw mensagem; // Lança para ser tratado no componente
                }
                console.error('Erro ao excluir a operadora', error);
                return of(false); // false = erro inesperado
            })
        );
    }
}
