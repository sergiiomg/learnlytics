import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Observable } from 'rxjs';

export interface Subject {
  _id: string;
  name: string;
  color: string;
  description: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  name: string;
  color: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  constructor(
    private http: HttpClient,
    private apiService: Api
  ) {}

  getSubjects(): Observable<any> {
    return this.http.get(`${this.apiService.baseUrl}/subjects`);
  }

  createSubject(data: CreateSubjectRequest): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/subjects`, data);
  }

  deleteSubject(id: string): Observable<any> {
    return this.http.delete(`${this.apiService.baseUrl}/subjects/${id}`);
  }

  updateSubject(id: string, data: CreateSubjectRequest): Observable<any> {
    return this.http.put(`${this.apiService.baseUrl}/subjects/${id}`, data);
  }
}