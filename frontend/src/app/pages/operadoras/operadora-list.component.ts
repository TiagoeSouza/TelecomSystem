// src/app/operadoras/operadora-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OperadoraService } from './operadora.service';
import { Operadora } from '../../models/operadora.model';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { NotificationService } from '../../shared/notification/notification.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';


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
    this.load();
  }

  load() {
    this.loading = true;
    this.service.getAll().subscribe(data => {
      this.operadoras = data;
      this.loading = false;
    });
  }

  remover(id: string) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Excluir Operadora';
    modalRef.componentInstance.message = 'Deseja realmente excluir esta operadora?';

    modalRef.result
      .then((confirmed) => {
        if (confirmed) {
          this.operadoras = this.operadoras.filter(o => o.id !== id);
          this.notify.success('Operadora excluída com sucesso.');
        }
      })
      .catch(() => {
        this.notify.info('Exclusão cancelada.');
      });
  }

  onBuscaChange() {
    this.page = 1; // Reinicia para a primeira página ao buscar
  }

  // Método para limpar o filtro
  limparFiltro(): void {
    this.filtro = '';  // Limpa o filtro
    this.onBuscaChange();  // Chama a função de busca para atualizar a exibição
  }
}
