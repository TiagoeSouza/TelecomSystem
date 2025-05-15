import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';
import { Contrato } from '../models/contrato.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
    private contratos: Contrato[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadData(): Observable<Contrato[]> {
        return this.apiService.get<Contrato[]>('Contratos').pipe(
            tap(data => {
                this.contratos = data;
                this.loaded = true;
            })
        );

    }

    getAll(force = false): Observable<Contrato[]> {
        if (this.loaded && !force) {
            return of([...this.contratos]);
        }
        return this.loadData();
    }

    getById(id: string): Observable<Contrato | undefined> {
        const response = this.apiService.get<Contrato>(`Contratos/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<Contrato, 'id'>): Observable<Contrato> {
        const nova = { id: generateGUID(), ...data };
        return this.apiService.post<Contrato>('Contratos', nova);
    }


    update(id: string, data: Omit<Contrato, 'id'>): Observable<Contrato | null> {
        return this.apiService.put<Contrato>(`Contratos/${id}`, data).pipe(
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Contrato não encontrada ao atualizar.');
                    return of(null);
                }
                console.error('Erro ao atualizar a contrato', error);
                throw error;
            })
        );
    }


    delete(id: string): Observable<boolean | null> {
        return this.apiService.delete(`Contratos/${id}`).pipe(
            map(() => true),
            catchError((error) => {
                if (error.status === 404) {
                    console.warn('Contrato não encontrada ao excluir.');
                    return of(null); // null = não encontrada
                }

                console.error('Erro ao excluir a contrato', error);
                return of(false); // false = erro inesperado
            })
        );
    }
}
