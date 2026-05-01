import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { Subject, SubjectService } from '../../services/subject';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonSpinner, IonBadge, CommonModule, FormsModule] 
})
export class SubjectsPage implements OnInit {
  subjects: Subject[] = [];

  name = '';
  color = '#3b82f6';
  description = '';

  editingSubjectId: string | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private subjectService: SubjectService) { }

  ngOnInit() {
    this.loadSubjects();
  }

  ionViewWillEnter(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.errorMessage = '';

    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.subjects || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al cargar asignaturas';
        this.loading = false;
      }
    });
  }

  createSubject(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    this.subjectService.createSubject({
      name: this.name,
      color: this.color,
      description: this.description
    }).subscribe({
      next: () => {
        this.successMessage = 'Asignatura creada correctamente';
        this.name = '';
        this.color = '#3b82f6';
        this.description = '';
        this.loadSubjects();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al crear asignatura';
      }
    });
  }

  startEdit(subject: Subject): void {
  this.editingSubjectId = subject._id;
  this.name = subject.name;
  this.color = subject.color;
  this.description = subject.description || '';
  this.errorMessage = '';
  this.successMessage = '';
}

cancelEdit(): void {
  this.editingSubjectId = null;
  this.name = '';
  this.color = '#3b82f6';
  this.description = '';
  this.errorMessage = '';
  this.successMessage = '';
}

saveSubject(): void {
  if (this.editingSubjectId) {
    this.updateSubject();
  } else {
    this.createSubject();
  }
}

updateSubject(): void {
  if (!this.editingSubjectId) return;

  this.errorMessage = '';
  this.successMessage = '';

  if (!this.name.trim()) {
    this.errorMessage = 'El nombre es obligatorio';
    return;
  }

  this.subjectService.updateSubject(this.editingSubjectId, {
    name: this.name,
    color: this.color,
    description: this.description
  }).subscribe({
    next: () => {
      this.successMessage = 'Asignatura actualizada correctamente';
      this.cancelEdit();
      this.loadSubjects();
    },
    error: (error) => {
      this.errorMessage = error.error?.message || 'Error al actualizar asignatura';
    }
  });
}

  deleteSubject(id: string): void {
    const confirmed = confirm('¿Seguro que quieres eliminar esta asignatura?');

    if (!confirmed) return;

    this.subjectService.deleteSubject(id).subscribe({
      next: () => {
        if (this.editingSubjectId === id) {
          this.cancelEdit();
        }
      
        this.loadSubjects();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al eliminar asignatura';
      }
    });
  }

}
