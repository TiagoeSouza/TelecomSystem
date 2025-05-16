import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { IFilial } from '../models/filial.model';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';

@Injectable({ providedIn: 'root' })
export class FilialService {
    private filiais: IFilial[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadData(): Observable<IFilial[]> {
        return this.apiService.get<IFilial[]>('Filiais').pipe(
            tap(data => {
                this.filiais = data;
                this.loaded = true;
            })
        );

    }

    getAll(force = false): Observable<IFilial[]> {
        if (this.loaded && !force) {
            return of([...this.filiais]);
        }
        return this.loadData();
    }

    getById(id: string): Observable<IFilial | undefined> {
        const response = this.apiService.get<IFilial>(`Filiais/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<IFilial, 'id'>): Observable<IFilial> {
        const nova = {
            ...data,
            id: generateGUID()
        };
        return this.apiService.post<IFilial>('Filiais', nova);
    }


    update(id: string, data: Omit<IFilial, 'id'>): Observable<IFilial | null> {
        return this.apiService.put<IFilial>(`Filiais/${id}`, data).pipe(
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
                if (error.status === 400) {
                    const mensagem =
                        typeof error.error === 'string'
                            ? error.error
                            : error.error?.message || 'Erro ao excluir: dados relacionados.';
                    throw mensagem; // Lança para ser tratado no componente
                }
                return of(false); // false = erro inesperado
            })
        );
    }
}
