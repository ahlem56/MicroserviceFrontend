import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

export type SalesChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-sales-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.css']
})
export class SalesSummaryComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public salesChartOptions: Partial<SalesChartOptions>;
  viewMode: 'monthly' | 'daily' = 'monthly';
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  months: { value: number; name: string }[] = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  years: number[] = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  constructor(private http: HttpClient) {
    this.salesChartOptions = {
      series: [],
      chart: {
        fontFamily: 'Nunito Sans, sans-serif',
        height: 300,
        type: 'area',
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 1 },
      grid: { strokeDashArray: 3 },
      xaxis: { categories: [] },
      yaxis: { title: { text: 'Revenue ($)' } },
      tooltip: { theme: 'dark' },
      legend: { show: false },
      colors: ['#3b82f6']
    };
  }

  ngOnInit(): void {
    this.loadMonthlyRevenue();
  }

  loadMonthlyRevenue(): void {
    this.http.get<Map<string, number>>('http://localhost:8089/examen/partners/revenue/monthly')
      .subscribe({
        next: (data) => {
          const revenueData = Object.values(data);
          const months = this.months.map(m => m.name);
          this.salesChartOptions.series = [{ name: 'Monthly Revenue', data: revenueData }];
          this.salesChartOptions.xaxis = { categories: months, title: { text: 'Month' } };
        },
        error: (err) => console.error('Error fetching monthly revenue:', err)
      });
  }

  loadDailyRevenue(): void {
    this.http.get<Map<string, number>>('http://localhost:8089/examen/partners/revenue/daily', {
      params: { month: this.selectedMonth.toString(), year: this.selectedYear.toString() }
    }).subscribe({
      next: (data) => {
        const revenueData = Object.values(data);
        const days = Object.keys(data);
        this.salesChartOptions.series = [{ name: 'Daily Revenue', data: revenueData }];
        this.salesChartOptions.xaxis = { categories: days, title: { text: `Day (Month: ${this.months[this.selectedMonth - 1].name} ${this.selectedYear})` } };
      },
      error: (err) => console.error('Error fetching daily revenue:', err)
    });
  }

  toggleView(mode: 'monthly' | 'daily'): void {
    this.viewMode = mode;
    if (mode === 'monthly') {
      this.loadMonthlyRevenue();
    } else {
      this.loadDailyRevenue();
    }
  }

  onDateChange(): void {
    if (this.viewMode === 'daily') {
      this.loadDailyRevenue();
    }
  }
}