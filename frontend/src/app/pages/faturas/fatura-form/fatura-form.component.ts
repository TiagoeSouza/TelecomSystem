import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ContratoService } from '../../../services/contrato.service';
import { FaturaService } from '../../../services/fatura.service';
import { NgxMaskDirective } from 'ngx-mask';
import { IFatura } from '../../../models/fatura.model';
import { IContrato } from '../../../models/contrato.model';
import { CnpjFormatPipe } from "../../../shared/pipes/cnpj-format.pipe";

@Component({
  selector: 'app-fatura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective, CnpjFormatPipe],
  templateUrl: './fatura-form.component.html',
})
export class FaturaFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  contratos: any[] = [];
  dataEmissaoMinima: string = '';
  dataVencimentoMinima: string = '';
  contratoSelecionado: IContrato | null = null;

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private contratoService: ContratoService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0];
    this.dataEmissaoMinima = hojeStr;
    this.dataVencimentoMinima = hojeStr;

    this.form = this.fb.group({
      id: [''],
      contratoId: ['', Validators.required],
      dataEmissao: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valorCobrado: ['', Validators.required],
      status: ['', Validators.required]
    });


    this.contratoService.getAll().subscribe((contratos) => (this.contratos = contratos));

    this.form.get('contratoId')?.valueChanges.subscribe((id) => {
      this.form.get('contrato.id')?.setValue(id, { emitEvent: false });
      const contrato = this.contratos.find(c => c.id === id);
      this.contratoSelecionado = contrato;
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = idParam;
      this.loading = true;
      this.faturaService.getById(this.editId).subscribe((fatura) => {
        if (fatura) {
          this.form.patchValue({
            ...fatura,
            dataEmissao: fatura.dataEmissao?.split('T')[0],
            dataVencimento: fatura.dataVencimento?.split('T')[0],
          });
          const contrato = this.contratos.find(c => c.id === fatura.contratoId);
          this.contratoSelecionado = contrato;
        }

        this.loading = false;
      });
    }
  }

  onSubmit() {
    console.log('Formulário enviado:', this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Formulário válido:', this.form.valid);
    this.loading = true;
    const faturaData = this.form.value as Omit<IFatura, 'id'>;

    const obs = this.editId
      ? this.faturaService.update(this.editId, faturaData)
      : this.faturaService.add(faturaData);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.notify.success(this.editId ? 'Fatura atualizada com sucesso.' : 'Fatura criada com sucesso.');
        this.router.navigate(['/faturas']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar fatura:', err);
        this.notify.error('Erro ao salvar a fatura. Tente novamente.');
      }
    });
  }
}
