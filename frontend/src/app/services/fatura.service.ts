import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IFatura } from '../models/fatura.model';
import { ApiService } from './ApiService';
import { generateGUID } from './helper.service';

@Injectable({ providedIn: 'root' })
export class FaturaService {
    private faturas: IFatura[] = [];
    private loaded = false;

    constructor(private apiService: ApiService) { }

    private loadData(): Observable<IFatura[]> {
        return this.apiService.get<IFatura[]>('Faturas').pipe(
            tap(data => {
                this.faturas = data;
                this.loaded = true;
            })
        );

    }


    getAll(force = false): Observable<IFatura[]> {
        if (this.loaded && !force) {
            return of([...this.faturas]);
        }
        return this.loadData();
    }

    getById(id: string): Observable<IFatura | undefined> {
        const response = this.apiService.get<IFatura>(`Faturas/${id}`).pipe(
            catchError(() => of(undefined))
        );
        console.log('getById', response);
        return response;
    }

    add(data: Omit<IFatura, 'id'>): Observable<IFatura> {
        const nova = {
            ...data,
            id: generateGUID(),
            status: Number(data.status),
        };
        console.log('nova', nova);
        return this.apiService.post<IFatura>('Faturas', nova);
    }


    update(id: string, data: Omit<IFatura, 'id'>): Observable<IFatura | null> {
        return this.apiService.put<IFatura>(`Faturas/${id}`, data).pipe(
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

    getTotaisGastoPorMes(mes: number, ano: number): Observable<any[]> {
        return this.apiService.get<any[]>(`Faturas/total-gasto-mes/${mes}/${ano}`).pipe(
            catchError(error => {
                console.error('Erro ao buscar totais de gasto por mês:', error);
                return of([]);
            })
        );
    }

}
