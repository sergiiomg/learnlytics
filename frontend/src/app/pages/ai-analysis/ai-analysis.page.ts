import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonText, IonSpinner, IonItem, IonSelect, IonSelectOption, IonList, IonBadge, IonLabel } from '@ionic/angular/standalone';
import { AiAnalysis, Ai } from '../../services/ai';
import { Subject, SubjectService } from '../../services/subject';

@Component({
  selector: 'app-ai-analysis',
  templateUrl: './ai-analysis.page.html',
  styleUrls: ['./ai-analysis.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonText, IonSpinner, IonItem, IonSelect, IonSelectOption, IonList, IonBadge, FormsModule, CommonModule]
})
export class AiAnalysisPage implements OnInit {

  subjects: Subject[] = [];
  selectedSubjectId = '';

  analysis: AiAnalysis | null = null;
  analysisTitle = '';

  loading = false;
  errorMessage = '';

  constructor(
    private aiService: Ai,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  ionViewWillEnter(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.subjects || [];

        if (!this.selectedSubjectId && this.subjects.length > 0) {
          this.selectedSubjectId = this.subjects[0]._id;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al cargar asignaturas';
      }
    });
  }

  analyzeGeneral(): void {
    this.loading = true;
    this.errorMessage = '';
    this.analysis = null;
    this.analysisTitle = 'Análisis general';

    this.aiService.analyzeGeneral().subscribe({
      next: (response) => {
        this.analysis = response.analysis;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al generar análisis general';
        this.loading = false;
      }
    });
  }

  analyzeSubject(): void {
    if (!this.selectedSubjectId) {
      this.errorMessage = 'Selecciona una asignatura';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.analysis = null;

    this.aiService.analyzeSubject(this.selectedSubjectId).subscribe({
      next: (response) => {
        this.analysis = response.analysis;
        this.analysisTitle = `Análisis de ${response.subject.name}`;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al generar análisis de asignatura';
        this.loading = false;
      }
    });
  }

}
