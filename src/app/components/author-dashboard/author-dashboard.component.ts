import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrl: './author-dashboard.component.css',
})
export class AuthorDashboardComponent implements OnInit {
  documents: any[] = [];
  selectedDoc: any = null;

  newDoc = {
    title: '',
    content: '',
    status: 'Draft',
  };

  message = '';
  messageType: 'success' | 'error' | 'info' | '' = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (data) => (this.documents = data),
      error: () => this.showMessage('Failed to load documents.', 'error'),
    });
  }

  saveDocument() {
    if (!this.newDoc.title || !this.newDoc.content) {
      this.showMessage('Please fill in all fields.', 'error');
      return;
    }

    const newDocument = {
      ...this.newDoc,
      createdBy: 'Author',
    };

    this.documentService.saveDocument(newDocument).subscribe({
      next: () => {
        this.showMessage('Document saved successfully!', 'success');
        this.newDoc = { title: '', content: '', status: 'Draft' };
        this.loadDocuments();
      },
      error: (err) => {
        console.error('❌ Save error:', err);
        this.showMessage('Failed to save document.', 'error');
      },
    });
  }

  submitForReview() {
    if (!this.newDoc.title || !this.newDoc.content) {
      this.showMessage('Please fill in all fields.', 'error');
      return;
    }

    const reviewDoc = {
      ...this.newDoc,
      status: 'Under Review',
      createdBy: 'Author',
    };

    this.documentService.saveDocument(reviewDoc).subscribe({
      next: () => {
        this.showMessage('Document submitted for review!', 'success');
        this.newDoc = { title: '', content: '', status: 'Draft' };
        this.loadDocuments();
      },
      error: (err) => {
        console.error('❌ Review error:', err);
        this.showMessage('Failed to submit for review.', 'error');
      },
    });
  }

  closePreview() {
    this.selectedDoc = null;
  }

  showMessage(text: string, type: 'success' | 'error' | 'info') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
