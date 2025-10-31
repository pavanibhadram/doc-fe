import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrl: './author-dashboard.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AuthorDashboardComponent implements OnInit {
  documents: any[] = [];
  showCreateForm = false;
  isEditing = false;
  formData = { title: '', content: '' };
  selectedDoc: any = null;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    const username = localStorage.getItem('username') || 'Author';
    this.documentService.getDocumentsByAuthor(username).subscribe({
      next: (docs: any[]) => (this.documents = docs),
      error: (err) => console.error('Error fetching documents', err),
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.isEditing = false;
    this.formData = { title: '', content: '' };
  }

  saveDraft(): void {
    if (!this.formData.title.trim() || !this.formData.content.trim()) {
      alert('⚠️ Please fill in both Title and Content before saving.');
      return;
    }

    const username = localStorage.getItem('username') || 'Author';
    const newDoc = { ...this.formData, author: username, status: 'Draft' };

    this.documentService.createDocument(newDoc).subscribe({
      next: () => {
        alert('💾 Document saved as draft!');
        this.loadDocuments();
        this.showCreateForm = false;
      },
      error: () => alert('❌ Failed to save draft.'),
    });
  }

  editDocument(doc: any): void {
    this.isEditing = true;
    this.showCreateForm = true;
    this.selectedDoc = doc;
    this.formData = { title: doc.title, content: doc.content };
  }

  submitForReview(): void {
    if (!this.formData.title.trim() || !this.formData.content.trim()) {
      alert('⚠️ Please fill in both Title and Content before submitting.');
      return;
    }

    const username = localStorage.getItem('username') || 'Author';
    const newDoc = {
      ...this.formData,
      author: username,
      status: 'Under Review',
    };

    this.documentService.createDocument(newDoc).subscribe({
      next: () => {
        alert('📤 Document sent to Reviewer successfully!');
        this.loadDocuments();
        this.showCreateForm = false;
      },
      error: () => alert('❌ Failed to submit document.'),
    });
  }
}
