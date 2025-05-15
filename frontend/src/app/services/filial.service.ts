import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Filial } from '../models/filial.model';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';

@Injectable({ providedIn: 'root' })
export class FilialService {
    private filiais: Filial[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadData(): Observable<Filial[]> {
        return this.apiService.get<Filial[]>('Filiais').pipe(
            tap(data => {
                this.filiais = data;
                this.loaded = true;
            })
        );

    }

    getAll(force = false): Observable<Filial[]> {
        if (this.loaded && !force) {
            return of([...this.filiais]);
        }
        return this.loadData();
    }

    getById(id: string): Observable<Filial | undefined> {
        const response = this.apiService.get<Filial>(`Filiais/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<Filial, 'id'>): Observable<Filial> {
        const nova = { id: generateGUID(), ...data };
        return this.apiService.post<Filial>('Filiais', nova);
    }


    update(id: string, data: Omit<Filial, 'id'>): Observable<Filial | null> {
        return this.apiService.put<Filial>(`Filiais/${id}`, data).pipe(
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Filial não encontrada ao atualizar.');
                    return of(null);
                }
                console.error('Erro ao atualizar a filial', error);
                throw error;
            })
        );
    }


    delete(id: string): Observable<boolean | null> {
        return this.apiService.delete(`Filiais/${id}`).pipe(
            map(() => true),
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Filial não encontrada ao excluir.');
                    return of(null); // null = não encontrada
                }

                console.error('Erro ao excluir a filial', error);
                return of(false); // false = erro inesperado
            })
        );
    }
}
