import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/notification/notification.service';
import { NgxMaskDirective } from 'ngx-mask';
import { FilialService } from '../../../services/filial.service';
import { IFilial } from '../../../models/filial.model';
import { validarCnpj } from '../../../services/helper.service';

@Component({
  selector: 'app-filial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './filial-form.component.html',
})

export class FilialFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: FilialService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      cnpj: ['', [Validators.required, validarCnpj()]],
      nome: ['', [Validators.required, Validators.minLength(10)]],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = idParam;
      this.loading = true;
      this.service.getById(this.editId).subscribe((filial) => {
        if (filial) {
          this.form.patchValue(filial);
        }
        this.loading = false;
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // exibe erros
      return;
    }

    this.loading = true;

    const filialData = this.form.value as Omit<IFilial, 'id'>;

    const obs = this.editId
      ? this.service.update(this.editId, filialData)
      : this.service.add(filialData);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.notify.success(this.editId ? 'Filial atualizada com sucesso.' : 'Filial criada com sucesso.');
        this.router.navigate(['/filiais']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar filial:', err);
        this.notify.error('Erro ao salvar a filial. Tente novamente.');
      }
    });

  }
}
