import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveDocument(doc: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, doc);
  }

  updateDocument(id: string, updatedDoc: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedDoc);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
