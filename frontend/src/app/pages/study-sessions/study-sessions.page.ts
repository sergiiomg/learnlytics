import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonSpinner, IonSelect, IonSelectOption, IonBadge, IonList} from '@ionic/angular/standalone';
import {StudySession, StudySessionService} from '../../services/study-session';
import {Subject, SubjectService} from '../../services/subject';

@Component({
  selector: 'app-study-sessions',
  templateUrl: './study-sessions.page.html',
  styleUrls: ['./study-sessions.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonSpinner, IonSelect, IonSelectOption, IonBadge, IonList]
})
export class StudySessionsPage implements OnInit {

  studySessions: StudySession[] = [];
  subjects: Subject[] = [];

  subject = '';
  date = new Date().toISOString().substring(0, 10);
  startTime = '17:00';
  endTime = '18:00';
  durationMinutes = 60;
  studyMethod = 'Pomodoro';
  concentrationLevel = 3;
  notes = '';

  editingSessionId: string | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private studySessionService: StudySessionService,
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  ionViewWillEnter(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadSubjects();
    this.loadStudySessions();
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

  loadStudySessions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studySessionService.getStudySessions().subscribe({
      next: (response) => {
        this.studySessions = response.studySessions || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al cargar sesiones';
        this.loading = false;
      }
    });
  }

  saveStudySession(): void {
    if (this.editingSessionId) {
      this.updateStudySession();
    } else {
      this.createStudySession();
    }
  }

   createStudySession(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.subject || !this.date || !this.startTime || !this.endTime || !this.studyMethod) {
      this.errorMessage = 'Completa todos los campos obligatorios';
      return;
    }

    this.studySessionService.createStudySession(this.getFormData()).subscribe({
      next: () => {
        this.successMessage = 'Sesión creada correctamente';
        this.resetForm();
        this.loadStudySessions();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al crear sesión';
      }
    });
  }

  updateStudySession(): void {
    if (!this.editingSessionId) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.studySessionService.updateStudySession(this.editingSessionId, this.getFormData()).subscribe({
      next: () => {
        this.successMessage = 'Sesión actualizada correctamente';
        this.resetForm();
        this.loadStudySessions();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al actualizar sesión';
      }
    });
  }

  startEdit(session: StudySession): void {
    this.editingSessionId = session._id;
    this.subject = session.subject._id;
    this.date = session.date.substring(0, 10);
    this.startTime = session.startTime;
    this.endTime = session.endTime;
    this.durationMinutes = session.durationMinutes;
    this.studyMethod = session.studyMethod;
    this.concentrationLevel = session.concentrationLevel;
    this.notes = session.notes || '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteStudySession(id: string): void {
    const confirmed = confirm('¿Seguro que quieres eliminar esta sesión?');

    if (!confirmed) return;

    this.studySessionService.deleteStudySession(id).subscribe({
      next: () => {
        if (this.editingSessionId === id) {
          this.resetForm();
        }

        this.loadStudySessions();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al eliminar sesión';
      }
    });
  }

  getFormData() {
    return {
      subject: this.subject,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      durationMinutes: Number(this.durationMinutes),
      studyMethod: this.studyMethod,
      concentrationLevel: Number(this.concentrationLevel),
      notes: this.notes
    };
  }

  resetForm(): void {
    this.editingSessionId = null;
    this.subject = this.subjects.length > 0 ? this.subjects[0]._id : '';
    this.date = new Date().toISOString().substring(0, 10);
    this.startTime = '17:00';
    this.endTime = '18:00';
    this.durationMinutes = 60;
    this.studyMethod = 'Pomodoro';
    this.concentrationLevel = 3;
    this.notes = '';
  }

}
