// src/app/operadoras/operadora-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OperadoraService } from '../../../services/operadora.service';
import { IOperadora } from '../../../models/operadora.model';
import { NotificationService } from '../../../shared/notification/notification.service';

@Component({
  selector: 'app-operadora-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './operadora-form.component.html',
})

export class OperadoraFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: OperadoraService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.editId = idParam;
    this.form = this.fb.group({
      id: [idParam ?? ''],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      tipoServico: ['', Validators.required],
      contatoSuporte: ['', [Validators.required, Validators.minLength(5)]]
    });

    if (this.editId) {
      this.form.get('id')?.addValidators(Validators.required);

      this.loading = true;
      this.service.getById(this.editId).subscribe((operadora) => {
        if (operadora) {
          this.form.patchValue(operadora);
        }
        this.loading = false;
      });
    }
  }

  onSubmit() {
    console.log('Formulário enviado:', this.form.value);
    console.log('Formulário válido:', this.form.valid);

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // exibe erros
      return;
    }

    this.loading = true;

    const operadoraData = this.form.value as Omit<IOperadora, 'id'>;

    const obs = this.editId
      ? this.service.update(this.editId, operadoraData)
      : this.service.add(operadoraData);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.notify.success(this.editId ? 'Operadora atualizada com sucesso.' : 'Operadora criada com sucesso.');
        this.router.navigate(['/operadoras']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar operadora:', err);
        this.notify.error('Erro ao salvar a operadora. Tente novamente.');
      }
    });

  }
}
