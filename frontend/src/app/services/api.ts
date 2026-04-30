import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  readonly baseUrl = 'http://localhost:3000/api';
}
