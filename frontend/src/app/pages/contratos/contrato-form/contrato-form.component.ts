import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ContratoService } from '../../../services/contrato.service';
import { FilialService } from '../../../services/filial.service';
import { OperadoraService } from '../../../services/operadora.service';
import { NgxMaskDirective } from 'ngx-mask';
import { IContrato } from '../../../models/contrato.model';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './contrato-form.component.html',
})
export class ContratoFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  filiais: any[] = [];
  operadoras: any[] = [];
  dtInicioMinima: string = '';
  dtVencimentoMinima: string = '';

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private filialService: FilialService,
    private operadoraService: OperadoraService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    const hoje = new Date();
    this.dtInicioMinima = hoje.toISOString().split('T')[0];
    this.dtVencimentoMinima = hoje.toISOString().split('T')[0];

    this.form = this.fb.group({
      id: [''],
      filialId: [''],
      filial: this.fb.group({
        id: ['', Validators.required],
        nome: [''],
        cnpj: ['']
      }),
      operadoraId: [''],
      operadora: this.fb.group({
        id: ['', Validators.required],
        nome: [''],
        tipoServico: [0],
        contatoSuporte: ['']
      }),
      planoContratado: ['', [Validators.required, Validators.minLength(3)]],
      dataInicio: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valorMensal: ['', Validators.required],
      status: ['', Validators.required]
    });



    this.filialService.getAll().subscribe((filiais) => this.filiais = filiais);
    this.operadoraService.getAll().subscribe((operadoras) => this.operadoras = operadoras);

    this.form.get('filial.id')?.valueChanges.subscribe((id) => {
      this.form.get('filialId')?.setValue(id, { emitEvent: false });
    });
    this.form.get('operadora.id')?.valueChanges.subscribe((id) => {
      this.form.get('operadoraId')?.setValue(id, { emitEvent: false });
    });

    const formatDate = (isoDate: string) => isoDate?.split('T')[0];

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = idParam;
      this.loading = true;
      this.contratoService.getById(this.editId).subscribe((contrato) => {
        if (contrato) this.form.patchValue({
          ...contrato,
          dataInicio: formatDate(contrato.dataInicio),
          dataVencimento: formatDate(contrato.dataVencimento),
          filial: { id: contrato.filialId },
          operadora: { id: contrato.operadoraId }
        });
        this.loading = false;
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const contratoData = this.form.value as Omit<IContrato, 'id'>;

    const obs = this.editId
      ? this.contratoService.update(this.editId, contratoData)
      : this.contratoService.add(contratoData);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.notify.success(this.editId ? 'Contrato atualizado com sucesso.' : 'Contrato criado com sucesso.');
        this.router.navigate(['/contratos']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar contrato:', err);
        this.notify.error('Erro ao salvar o contrato. Tente novamente.');
      }
    });
  }
}
