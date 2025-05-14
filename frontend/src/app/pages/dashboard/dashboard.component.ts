import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType, Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Fatura } from '../../models/fatura.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Correção para o caminho de styleUrls
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgChartsModule],
})
export class DashboardComponent implements OnInit {
  faturas: Fatura[] = [];
  totalFaturas = 0;
  totalFaturado = 0;

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log('DashboardComponent initialized');
    // Carregar os dados das faturas do mock JSON
    this.http.get<Fatura[]>('assets/mocks/faturas.json').subscribe(data => {
      this.faturas = data;
      console.log('Faturas loaded:', this.faturas);
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
