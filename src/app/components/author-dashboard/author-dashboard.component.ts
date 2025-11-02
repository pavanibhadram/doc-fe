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
  filteredDocuments: any[] = [];

  showCreateForm = false;
  isEditing = false;
  selectedDoc: any = null;

  formData = { title: '', content: '' };

  statuses: string[] = [
    'All',
    'Draft',
    'Under Review',
    'Approved by Reviewer',
    'Sent Back to Author',
    'Approved & Signed',
  ];
  selectedStatus = 'All';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (docs: any[]) => {
        this.documents = docs;
        this.applyFilter();
      },
      error: (err) => console.log(err),
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'All') {
      this.filteredDocuments = this.documents;
    } else {
      this.filteredDocuments = this.documents.filter(
        (d) => d.status === this.selectedStatus
      );
    }
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    this.isEditing = false;
    this.formData = { title: '', content: '' };
  }

  saveDraft() {
    if (!this.formData.title.trim() || !this.formData.content.trim()) {
      alert('⚠️ please fill all fields');
      return;
    }

    const payload = { ...this.formData, status: 'Draft' };

    this.documentService.createDocument(payload).subscribe({
      next: () => {
        alert('✅ Draft Saved');
        this.loadDocuments();
        this.showCreateForm = false;
      },
      error: () => alert('❌ Failed to save draft'),
    });
  }

  submitForReview() {
    if (!this.formData.title.trim() || !this.formData.content.trim()) {
      alert('⚠️ please fill all fields');
      return;
    }

    const payload = { ...this.formData, status: 'Under Review' };

    this.documentService.createDocument(payload).subscribe({
      next: () => {
        alert('📨 Sent to Reviewer');
        this.loadDocuments();
        this.showCreateForm = false;
      },
      error: () => alert('❌ Failed to submit'),
    });
  }

  startEdit(doc: any) {
    this.isEditing = true;
    this.showCreateForm = true;
    this.selectedDoc = doc;
    this.formData = { title: doc.title, content: doc.content };
  }

  updateAndSendForReview() {
    if (!this.selectedDoc) return;
    if (!this.formData.title.trim() || !this.formData.content.trim()) {
      alert('⚠️ Please fill Title and Content before updating.');
      return;
    }

    const updatedDoc = {
      ...this.selectedDoc,
      title: this.formData.title,
      content: this.formData.content,
      status: 'Under Review',
    };

    this.documentService.updateDocument(updatedDoc._id, updatedDoc).subscribe({
      next: () => {
        alert('📤 Document updated & sent back to Reviewer');
        this.loadDocuments();
        this.isEditing = false;
        this.showCreateForm = false;
        this.formData = { title: '', content: '' };
        this.selectedDoc = null;
      },
      error: () => alert('❌ Failed to update'),
    });
  }
}
