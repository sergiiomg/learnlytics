import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { Analytics, AnalyticsSummary } from '../../services/analytics';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonSpinner, IonBadge, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

  summary: AnalyticsSummary | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private auth: Auth,
    private analyticsService: Analytics,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSummary();
  }

  ionViewWillEnter(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.errorMessage = '';

    this.analyticsService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al cargar estadísticas';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
