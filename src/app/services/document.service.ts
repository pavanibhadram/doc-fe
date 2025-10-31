import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api/documents`;

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDocumentsByAuthor(author: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?author=${author}`);
  }

  createDocument(document: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, document);
  }

  // ✅ For older components
  saveDocument(document: any): Observable<any> {
    return this.createDocument(document);
  }

  updateDocument(id: string, documentData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, documentData);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  submitForReview(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/submit`, {}); // matches backend route
  }
}
