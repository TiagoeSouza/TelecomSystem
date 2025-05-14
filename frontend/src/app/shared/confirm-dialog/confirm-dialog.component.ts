import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirmação';
  @Input() message = 'Tem certeza que deseja continuar?';

  constructor(public activeModal: NgbActiveModal) { }
}
