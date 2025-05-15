// src/app/operadoras/operadora-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { get } from 'http';
import { filter, switchMap, catchError, of } from 'rxjs';
import { Operadora } from '../../../models/operadora.model';
import { OperadoraService } from '../../../services/operadora.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../shared/notification/notification.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';


@Component({
  selector: 'app-operadora-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent,
    FormsModule
  ],
  styleUrl: 'operadora-list.component.css',
  templateUrl: './operadora-list.component.html',
})

export class OperadoraListComponent implements OnInit {
  operadoras: Operadora[] = [];

  loading = false;
  filtro = '';

  page = 1;
  pageSize = 5;
  get operadorasPaginadas(): Operadora[] {
    const start = (this.page - 1) * this.pageSize;
    return this.operadorasFiltradas.slice(start, start + this.pageSize);
  }

  get operadorasFiltradas(): Operadora[] {
    return this.operadoras.filter(op =>
      op.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
      op.tipoServico.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  constructor(private service: OperadoraService, private modalService: NgbModal, private notify: NotificationService) { }

  ngOnInit() {
    this.load(true);
  }

  load(force = false) {
    this.loading = true;
    this.service.getAll(force).subscribe({
      next: (data) => {
        this.operadoras = data;
        this.loading = false;
      }
      , error: (error) => {
        this.loading = false;
      }
    });
  }

  remover(id: string) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Excluir Operadora';
    modalRef.componentInstance.message = 'Deseja realmente excluir esta operadora?';

    modalRef.result
      .then((confirmed) => {
        if (!confirmed) {
          this.notify.info('Exclusão cancelada.');
          return;
        }

        // Primeiro tento buscar a operadora
        this.service.getById(id).pipe(
          catchError((error) => {
            if (error.status === 404) {
              this.notify.warning('Operadora não encontrada.');
            } else {
              this.notify.error('Erro ao buscar a operadora.');
            }
            return of(null); // Retorno null para interromper o fluxo
          }),
          switchMap((operadora) => {
            // Se a operadora for null, não devo excluir
            if (!operadora) {
              return of(null); // Retorno null para interromper
            }
            return this.service.delete(id); // Caso contrário, tento excluir
          }),
          catchError((error) => {
            // Caso apresente erro no delete mostro mensagem
            this.notify.error('Erro ao excluir a operadora.');
            return of(false); // Retorno falso indicando falha
          })
        ).subscribe((result) => {
          if (result === true) {
            this.operadoras = this.operadoras.filter(o => o.id !== id);
            this.notify.success('Operadora excluída com sucesso.');
          } else if (result === null) {
            // Caso a operadora não tenha sido encontrada apresdento mensagem em tela
            this.notify.error('Operadora não encontrada.');
          } else {
            // Caso erro inesperado
            this.notify.error('Erro ao excluir a operadora.');
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
