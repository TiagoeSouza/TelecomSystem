import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, catchError, of } from 'rxjs';
import { Filial } from '../../../models/filial.model';
import { FilialService } from '../../../services/filial.service';


@Component({
  selector: 'app-filial-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent,
    FormsModule
  ],
  templateUrl: './filial-list.component.html',
})

export class FilialListComponent implements OnInit {
  filiais: Filial[] = [];

  loading = false;
  filtro = '';

  page = 1;
  pageSize = 5;
  get filiaisPaginadas(): Filial[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filiaisFiltradas.slice(start, start + this.pageSize);
  }

  get filiaisFiltradas(): Filial[] {
    return this.filiais.filter(fl =>
      fl.cnpj.toLowerCase().includes(this.filtro.toLowerCase()) ||
      fl.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  constructor(private service: FilialService, private modalService: NgbModal, private notify: NotificationService) { }

  ngOnInit() {
    this.load(true);
  }

  load(force = false) {
    this.loading = true;
    this.service.getAll(force).subscribe({
      next: (data) => {
        this.filiais = data;
        this.loading = false;
      }
      , error: (error) => {
        this.loading = false;
      }
    });
  }

  remover(id: string) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Excluir Filial';
    modalRef.componentInstance.message = 'Deseja realmente excluir esta filial?';

    modalRef.result
      .then((confirmed) => {
        if (!confirmed) {
          this.notify.info('Exclusão cancelada.');
          return;
        }

        // Primeiro tento buscar a filial
        this.service.getById(id).pipe(
          catchError((error) => {
            if (error.status === 404) {
              this.notify.warning('Filial não encontrada.');
            } else {
              this.notify.error('Erro ao buscar a filial.');
            }
            return of(null); // Retorno null para interromper o fluxo
          }),
          switchMap((filial) => {
            // Se a filial for null, não devo excluir
            if (!filial) {
              return of(null); // Retorno null para interromper
            }
            return this.service.delete(id); // Caso contrário, tento excluir
          }),
          catchError((error) => {
            // Caso apresente erro no delete mostro mensagem
            this.notify.error('Erro ao excluir a filial.');
            return of(false); // Retorno falso indicando falha
          })
        ).subscribe((result) => {
          if (result === true) {
            this.filiais = this.filiais.filter(o => o.id !== id);
            this.notify.success('Filial excluída com sucesso.');
          } else if (result === null) {
            // Caso a filial não tenha sido encontrada apresdento mensagem em tela
            this.notify.error('Filial não encontrada.');
          } else {
            // Caso erro inesperado
            this.notify.error('Erro ao excluir a filial.');
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
