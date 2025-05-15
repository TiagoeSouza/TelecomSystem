import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, catchError, of } from 'rxjs';
import { Fatura } from '../../../models/fatura.model';
import { FaturaService } from '../../../services/fatura.service';


@Component({
  selector: 'app-fatura-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent,
    FormsModule
  ],
  templateUrl: './fatura-list.component.html',
})

export class FaturaListComponent implements OnInit {
  faturas: Fatura[] = [];

  loading = false;
  filtro = '';

  page = 1;
  pageSize = 5;
  get faturasPaginadas(): Fatura[] {
    const start = (this.page - 1) * this.pageSize;
    return this.faturasFiltradas.slice(start, start + this.pageSize);
  }

  get faturasFiltradas(): Fatura[] {
    return this.faturas.filter(fl =>
      fl.dataVencimento.toLowerCase().includes(this.filtro.toLowerCase()) ||
      fl.status.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  constructor(private service: FaturaService, private modalService: NgbModal, private notify: NotificationService) { }

  ngOnInit() {
    this.load(true);
  }

  load(force = false) {
    this.loading = true;
    this.service.getAll(force).subscribe({
      next: (data) => {
        this.faturas = data;
        this.loading = false;
      }
      , error: (error) => {
        this.loading = false;
      }
    });
  }

  remover(id: string) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Excluir Fatura';
    modalRef.componentInstance.message = 'Deseja realmente excluir esta fatura?';

    modalRef.result
      .then((confirmed) => {
        if (!confirmed) {
          this.notify.info('Exclusão cancelada.');
          return;
        }

        // Primeiro tento buscar a Fatura
        this.service.getById(id).pipe(
          catchError((error) => {
            if (error.status === 404) {
              this.notify.warning('Fatura não encontrada.');
            } else {
              this.notify.error('Erro ao buscar a Fatura.');
            }
            return of(null); // Retorno null para interromper o fluxo
          }),
          switchMap((fatura) => {
            // Se a Fatura for null, não devo excluir
            if (!fatura) {
              return of(null); // Retorno null para interromper
            }
            return this.service.delete(id); // Caso contrário, tento excluir
          }),
          catchError((error) => {
            // Caso apresente erro no delete mostro mensagem
            this.notify.error('Erro ao excluir a fatura.');
            return of(false); // Retorno falso indicando falha
          })
        ).subscribe((result) => {
          if (result === true) {
            this.faturas = this.faturas.filter(o => o.id !== id);
            this.notify.success('Fatura excluída com sucesso.');
          } else if (result === null) {
            // Caso a Fatura não tenha sido encontrada apresdento mensagem em tela
            this.notify.error('Fatura não encontrada.');
          } else {
            // Caso erro inesperado
            this.notify.error('Erro ao excluir a fatura.');
          }
        });
      })
      .catch(() => {
        this.notify.info('Exclusão cancelada.');
      });
  }

  onBuscaChange() {
    this.page = 1;
  }

  // Método para limpar/atualizar o filtro/tela
  limparFiltro(): void {
    this.filtro = '';
    this.page = 1;
    this.load(true);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
  }


}
