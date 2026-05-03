import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Observable } from 'rxjs';

export interface AiAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detectedPatterns: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Ai {
  constructor(private http: HttpClient, private api: Api) {}

  analyzeGeneral(): Observable<{ ok: boolean; analysis: AiAnalysis }> {
    return this.http.post<{ ok: boolean; analysis: AiAnalysis }>(
      `${this.api.baseUrl}/ai/analyze`,
      {}
    );
  }

  analyzeSubject(subjectId: string): Observable<{
    ok: boolean;
    subject: {
      id: string;
      name: string;
      color: string;
    };
    analysis: AiAnalysis;
  }> {
    return this.http.post<{
      ok: boolean;
      subject: {
        id: string;
        name: string;
        color: string;
      };
      analysis: AiAnalysis;
    }>(
      `${this.api.baseUrl}/ai/analyze/subject/${subjectId}`,
      {}
    );
  }
}
