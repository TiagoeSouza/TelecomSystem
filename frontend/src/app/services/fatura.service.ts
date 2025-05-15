import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Fatura } from '../models/fatura.model';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';

@Injectable({ providedIn: 'root' })
export class FaturaService {
    private faturas: Fatura[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadData(): Observable<Fatura[]> {
        return this.apiService.get<Fatura[]>('Faturas').pipe(
            tap(data => {
                this.faturas = data;
                this.loaded = true;
            })
        );

    }


    getAll(force = false): Observable<Fatura[]> {
        if (this.loaded && !force) {
            return of([...this.faturas]);
        }
        return this.loadData();
    }

    getById(id: string): Observable<Fatura | undefined> {
        const response = this.apiService.get<Fatura>(`Faturas/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<Fatura, 'id'>): Observable<Fatura> {
        const nova = { id: generateGUID(), ...data };
        return this.apiService.post<Fatura>('Faturas', nova);
    }


    update(id: string, data: Omit<Fatura, 'id'>): Observable<Fatura | null> {
        return this.apiService.put<Fatura>(`Faturas/${id}`, data).pipe(
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Fatura não encontrada ao atualizar.');
                    return of(null);
                }
                console.error('Erro ao atualizar a fatura', error);
                throw error;
            })
        );
    }


    delete(id: string): Observable<boolean | null> {
        return this.apiService.delete(`Faturas/${id}`).pipe(
            map(() => true),
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Fatura não encontrada ao excluir.');
                    return of(null); // null = não encontrada
                }

                console.error('Erro ao excluir a fatura', error);
                return of(false); // false = erro inesperado
            })
        );
    }

}
