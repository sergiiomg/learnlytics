import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Observable } from 'rxjs';

export interface StudySessionSubject {
  _id: string;
  name: string;
  color: string;
}

export interface StudySession {
  _id: string;
  subject: StudySessionSubject;
  user: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  studyMethod: string;
  concentrationLevel: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySessionRequest {
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  studyMethod: string;
  concentrationLevel: number;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudySessionService {
  constructor(
    private http: HttpClient,
    private apiService: Api
  ) {}

  getStudySessions(): Observable<any> {
    return this.http.get(`${this.apiService.baseUrl}/study-sessions`);
  }

  createStudySession(data: StudySessionRequest): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/study-sessions`, data);
  }

  updateStudySession(id: string, data: StudySessionRequest): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/study-sessions/${id}`, data);
  }

  deleteStudySession(id: string): Observable<any> {
    return this.http.delete(`${this.apiService.baseUrl}/study-sessions/${id}`);
  }
}