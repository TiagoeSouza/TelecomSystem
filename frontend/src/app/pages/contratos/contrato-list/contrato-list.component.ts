import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, catchError, of } from 'rxjs';
import { IContrato } from '../../../models/contrato.model';
import { ContratoService } from '../../../services/contrato.service';


@Component({
  selector: 'app-contrato-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent,
    FormsModule
  ],
  templateUrl: './contrato-list.component.html',
})

export class ContratoListComponent implements OnInit {
  contratos: IContrato[] = [];

  loading = false;
  filtro = '';

  page = 1;
  pageSize = 5;
  get contratosPaginados(): IContrato[] {
    const start = (this.page - 1) * this.pageSize;
    return this.contratosFiltrados.slice(start, start + this.pageSize);
  }

  get contratosFiltrados(): IContrato[] {
    return this.contratos.filter(ct =>
      ct.planoContratado.toLowerCase().includes(this.filtro.toLowerCase()) ||
      ct.filial.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  constructor(private service: ContratoService, private modalService: NgbModal, private notify: NotificationService) { }

  ngOnInit() {
    this.load(true);
  }

  load(force = false) {
    this.loading = true;
    this.service.getAll(force).subscribe({
      next: (data) => {
        this.contratos = data;
        this.loading = false;
      }
      , error: (error) => {
        this.loading = false;
      }
    });
  }

  remover(id: string) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Excluir Contrato';
    modalRef.componentInstance.message = 'Deseja realmente excluir esta contrato?';

    modalRef.result
      .then((confirmed) => {
        if (!confirmed) {
          this.notify.info('Exclusão cancelada.');
          return;
        }

        // Primeiro tento buscar a Contrato
        this.service.getById(id).pipe(
          catchError((error) => {
            if (error.status === 404) {
              this.notify.warning('Contrato não encontrada.');
            } else {
              this.notify.error('Erro ao buscar a contrato.');
            }
            return of(null); // Retorno null para interromper o fluxo
          }),
          switchMap((contrato) => {
            // Se a Contrato for null, não devo excluir
            if (!contrato) {
              return of(null); // Retorno null para interromper
            }
            return this.service.delete(id); // Caso contrário, tento excluir
          }),
          catchError((error) => {
            // Caso apresente erro no delete mostro mensagem
            this.notify.error('Erro ao excluir a contrato.');
            return of(false); // Retorno falso indicando falha
          })
        ).subscribe((result) => {
          if (result === true) {
            this.contratos = this.contratos.filter(o => o.id !== id);
            this.notify.success('Contrato excluída com sucesso.');
          } else if (result === null) {
            // Caso a Contrato não tenha sido encontrada apresdento mensagem em tela
            this.notify.error('Contrato não encontrada.');
          } else {
            // Caso erro inesperado
            this.notify.error('Erro ao excluir a contrato.');
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
