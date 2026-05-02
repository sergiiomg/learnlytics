import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Observable } from 'rxjs';

export interface ExamSubject {
  _id: string;
  name: string;
  color: string;
}

export interface Exam {
  _id: string;
  subject: ExamSubject;
  user: string;
  title: string;
  date: string;
  score: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamRequest {
  subject: string;
  title: string;
  date: string;
  score: number;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class Exam {

  constructor(
    private http: HttpClient,
    private apiService: Api
  ) {}

  getExams(): Observable<any> {
    return this.http.get(`${this.apiService.baseUrl}/exams`);
  }

  createExam(data: ExamRequest): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/exams`, data);
  }

  updateExam(id: string, data: ExamRequest): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/exams/${id}`, data);
  }

  deleteExam(id: string): Observable<any> {
    return this.http.delete(`${this.apiService.baseUrl}/exams/${id}`);
  }
  
}
