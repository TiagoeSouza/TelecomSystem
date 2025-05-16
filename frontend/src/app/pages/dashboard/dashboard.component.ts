import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType, Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { IFatura } from '../../models/fatura.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ApiService } from '../../services/ApiService';
import { FaturaService } from '../../services/fatura.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DashboardComponent } from './dashboard.component';
// ``````typescript
//   imports: [
//     CommonModule,
//     FormsModule
//   ],

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Correção para o caminho de styleUrls
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgChartsModule, FormsModule],
})
export class DashboardComponent implements OnInit {
  faturas: IFatura[] = [];
  totalFaturas = 0;
  totalFaturado = 0;
  totaisPorFilial: any[] = [];
  mesesAnos: { value: string; label: string }[] = [];
  mesAnoSelecionado: string = '';

  // Dados do gráfico de pizza
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Pagas', 'Pendentes', 'Atrasadas'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };
  pieChartType: ChartType = 'pie';

  // Dados do gráfico de barras
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Emitidas', data: [], backgroundColor: '#42A5F5' },
      { label: 'Pagas', data: [], backgroundColor: '#66BB6A' }
    ]
  };
  barChartType: ChartType = 'bar';
  preencherMesesAnos() {
    const hoje = new Date();
    const mesesNome = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (let i = 0; i < 12; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const mes = data.getMonth() + 1; // 1-12
      const ano = data.getFullYear();

      const label = `${mesesNome[data.getMonth()]}/${ano}`;
      // valor no formato "MM/YYYY", ex: "05/2025"
      const value = `${mes.toString().padStart(2, '0')}/${ano}`;

      this.mesesAnos.push({ label, value });
    }
  }

  carregarTotais() {
    if (!this.mesAnoSelecionado) return;

    // extrair mês e ano do valor selecionado "MM/YYYY"
    const [mesStr, anoStr] = this.mesAnoSelecionado.split('/');
    const mes = parseInt(mesStr, 10);
    const ano = parseInt(anoStr, 10);

    this.service.getTotaisGastoPorMes(mes, ano).subscribe((data) => {
      this.totaisPorFilial = data;
    });
  }

  constructor(private service: FaturaService) { }

  ngOnInit() {
    console.log('DashboardComponent initialized');
    this.preencherMesesAnos();
    this.mesAnoSelecionado = this.mesesAnos[0]?.value || '';
    this.carregarTotais();
    // Carregar os dados das faturas do mock JSON
    // this.http.get<IFatura[]>('assets/mocks/faturas.json').subscribe(data => {
    //   this.faturas = data;
    //   console.log('Faturas loaded:', this.faturas);
    // })

    this.service.getAll().subscribe(data => {
      this.faturas = data;
      //   console.log('Faturas loaded:', this.faturas);
    }).add(() => {
      console.log('Faturas loading completed');
      this.processarDados();
    });
  }

  processarDados() {
    // Calcular o total de faturas e o valor total faturado
    this.totalFaturas = this.faturas.length;
    this.totalFaturado = this.faturas.reduce((s, f) => s + f.valorCobrado, 0);

    // Contar o número de faturas por status
    const pagas = this.faturas.filter(f => f.status === 'Paga').length;
    const pendentes = this.faturas.filter(f => f.status === 'Pendente').length;
    const atrasadas = this.faturas.filter(f => f.status === 'Atrasada').length;

    // Atualizar os dados do gráfico de pizza
    this.pieChartData.datasets[0].data = [pagas, pendentes, atrasadas];

    // Organizar os dados mensais para o gráfico de barras
    const meses: string[] = [];
    const emitidasPorMes: { [mes: string]: number } = {};
    const pagasPorMes: { [mes: string]: number } = {};

    this.faturas.forEach(f => {
      const data = new Date(f.dataEmissao);
      const mes = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!meses.includes(mes)) meses.push(mes);

      emitidasPorMes[mes] = (emitidasPorMes[mes] || 0) + 1;
      if (f.status === 'Paga') {
        pagasPorMes[mes] = (pagasPorMes[mes] || 0) + 1;
      }
    });

    meses.sort();
    this.barChartData.labels = meses;
    this.barChartData.datasets[0].data = meses.map(m => emitidasPorMes[m] || 0);
    this.barChartData.datasets[1].data = meses.map(m => pagasPorMes[m] || 0);

    // Forçar a atualização dos gráficos
    if (this.pieChartData && this.barChartData) {
      setTimeout(() => {
        // Atualizar os gráficos
        this.updateCharts();
      });
    }
  }

  // Método para forçar a atualização dos gráficos
  updateCharts() {
    const pieChartCanvas = document.getElementById('pieChart') as HTMLCanvasElement;
    const barChartCanvas = document.getElementById('barChart') as HTMLCanvasElement;

    if (pieChartCanvas && barChartCanvas) {
      // Atualizar os gráficos
      const pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: this.pieChartData,
        options: {
          responsive: true
        }
      });

      const barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: this.barChartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
