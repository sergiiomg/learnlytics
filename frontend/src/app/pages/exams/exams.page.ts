import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,  IonTextarea, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonSpinner, IonSelect, IonSelectOption, IonBadge, IonList } from '@ionic/angular/standalone';
import { Exam } from '../../services/exam';
import { Subject, SubjectService } from '../../services/subject';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonInput,  IonTextarea, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonSpinner, IonSelect, IonSelectOption, IonBadge, IonList]
})
export class ExamsPage implements OnInit {

  exams: Exam[] = [];
  subjects: Subject[] = [];

  subject = '';
  title = '';
  date = new Date().toISOString().substring(0, 10);
  score = 5;
  notes = '';

  editingExamId: string | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private examService: Exam,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ionViewWillEnter(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadSubjects();
    this.loadExams();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.subjects || [];

        if (!this.subject && this.subjects.length > 0) {
          this.subject = this.subjects[0]._id;
        }
      },
      error: () => {
        this.errorMessage = 'Error al cargar asignaturas';
      }
    });
  }

   loadExams(): void {
    this.loading = true;
    this.errorMessage = '';

    this.examService.getExams().subscribe({
      next: (response) => {
        this.exams = response.exams || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al cargar exámenes';
        this.loading = false;
      }
    });
  }

  saveExam(): void {
    if (this.editingExamId) {
      this.updateExam();
    } else {
      this.createExam();
    }
  }

  createExam(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.subject || !this.title.trim() || !this.date) {
      this.errorMessage = 'Completa todos los campos obligatorios';
      return;
    }

    this.examService.createExam(this.getFormData()).subscribe({
      next: () => {
        this.successMessage = 'Examen creado correctamente';
        this.resetForm();
        this.loadExams();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al crear examen';
      }
    });
  }

  updateExam(): void {
    if (!this.editingExamId) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.subject || !this.title.trim() || !this.date) {
      this.errorMessage = 'Completa todos los campos obligatorios';
      return;
    }

    this.examService.updateExam(this.editingExamId, this.getFormData()).subscribe({
      next: () => {
        this.successMessage = 'Examen actualizado correctamente';
        this.resetForm();
        this.loadExams();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al actualizar examen';
      }
    });
  }

  startEdit(exam: Exam): void {
    this.editingExamId = exam._id;
    this.subject = exam.subject._id;
    this.title = exam.title;
    this.date = exam.date.substring(0, 10);
    this.score = exam.score;
    this.notes = exam.notes || '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteExam(id: string): void {
    const confirmed = confirm('¿Seguro que quieres eliminar este examen?');

    if (!confirmed) return;

    this.examService.deleteExam(id).subscribe({
      next: () => {
        if (this.editingExamId === id) {
          this.resetForm();
        }

        this.loadExams();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al eliminar examen';
      }
    });
  }

  getFormData() {
    return {
      subject: this.subject,
      title: this.title,
      date: this.date,
      score: Number(this.score),
      notes: this.notes
    };
  }

  resetForm(): void {
    this.editingExamId = null;
    this.subject = this.subjects.length > 0 ? this.subjects[0]._id : '';
    this.title = '';
    this.date = new Date().toISOString().substring(0, 10);
    this.score = 5;
    this.notes = '';
  }

}
