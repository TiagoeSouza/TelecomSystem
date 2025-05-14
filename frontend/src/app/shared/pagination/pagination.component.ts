import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted ms-auto">
        Página {{ page }} de {{ totalPages }} —
        Total: {{ totalItems }} registro{{ totalItems !== 1 ? 's' : '' }}
      </small>
    </div>

    <nav *ngIf="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="page === 1">
          <button class="page-link" (click)="selectPage(page - 1)">Anterior</button>
        </li>

        <li
          class="page-item"
          *ngFor="let p of pages"
          [class.active]="p === page"
        >
          <button class="page-link" (click)="selectPage(p)">{{ p }}</button>
        </li>

        <li class="page-item" [class.disabled]="page === totalPages">
          <button class="page-link" (click)="selectPage(page + 1)">Próximo</button>
        </li>
      </ul>
    </nav>
  `,
    styles: [],
})
export class PaginationComponent {
    @Input() totalItems = 0;
    @Input() pageSize = 10;
    @Input() page = 1;
    @Output() pageChange = new EventEmitter<number>();

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    selectPage(p: number) {
        if (p < 1 || p > this.totalPages || p === this.page) return;
        this.pageChange.emit(p);
    }
}
