import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Observable } from 'rxjs';

export interface StudyHoursBySubject {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  totalMinutes: number;
  totalHours: number;
}

export interface AverageScoreBySubject {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  averageScore: number;
}

export interface AnalyticsSummary {
  totalSubjects: number;
  totalStudySessions: number;
  totalExams: number;
  totalStudyMinutes: number;
  totalStudyHours: number;
  averageConcentration: number;
  mostUsedStudyMethod: string | null;
  averageScore: number;
  studyHoursBySubject: StudyHoursBySubject[];
  averageScoreBySubject: AverageScoreBySubject[];
}

@Injectable({
  providedIn: 'root',
})
export class Analytics {
  constructor(private http: HttpClient, private apiService: Api) {}

  getSummary(): Observable<{ ok: boolean; summary: AnalyticsSummary }> {
    return this.http.get<{ ok: boolean; summary: AnalyticsSummary }>(
      `${this.apiService.baseUrl}/analytics/summary`
    );
  }
}
