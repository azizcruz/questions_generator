import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestionsForm } from './questions-form.types';
import { Observable } from 'rxjs';
import { buildUrl } from '../../../../../../constants';

@Injectable({
  providedIn: 'root'
})
export class QuestionsServiceService {

  constructor(private http: HttpClient) { }

  submitFormData(formData: object): Observable<any> {
    return this.http.post(buildUrl('/api/search-history'), formData);
  }
  
}
