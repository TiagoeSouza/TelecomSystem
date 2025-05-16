import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';
import { IContrato } from '../models/contrato.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
    private contratos: IContrato[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadData(): Observable<IContrato[]> {
        return this.apiService.get<IContrato[]>('Contratos').pipe(
            tap(data => {
                console.log('loadData', data);
                this.contratos = data;
                this.loaded = true;
            })
        );

    }

    getAll(force = false): Observable<IContrato[]> {
        if (this.loaded && !force) {
            return of([...this.contratos]);
        }
        return this.loadData();
    }

    getById(id: string): Observable<IContrato | undefined> {
        const response = this.apiService.get<IContrato>(`Contratos/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<IContrato, 'id'>): Observable<IContrato> {
        console.log('add', data);
        const nova = {
            ...data,
            id: generateGUID(),
        };
        console.log('nova', nova);
        return this.apiService.post<IContrato>('Contratos', nova);
    }


    update(id: string, data: Omit<IContrato, 'id'>): Observable<IContrato | null> {
        return this.apiService.put<IContrato>(`Contratos/${id}`, data).pipe(
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
