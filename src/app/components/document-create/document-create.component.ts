import { Component } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-document-create',
  templateUrl: './document-create.component.html',
  styleUrl: './document-create.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DocumentCreateComponent {
  documentTitle = '';
  documentContent = '';

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private router: Router
  ) {}

  saveDraft() {
    if (!this.documentTitle.trim() || !this.documentContent.trim()) {
      alert('Please fill Title and Content.');
      return;
    }
    const doc = {
      title: this.documentTitle,
      content: this.documentContent,
      status: 'Draft',
      author: this.authService.getUsername(),
    };

    this.documentService.saveDocument(doc).subscribe({
      next: () => {
        alert('Draft saved');
        this.documentTitle = '';
        this.documentContent = '';
      },
      error: () => alert('Failed to save draft'),
    });
  }

  sendForReview() {
    if (!this.documentTitle.trim() || !this.documentContent.trim()) {
      alert('Please fill Title and Content.');
      return;
    }
    const doc = {
      title: this.documentTitle,
      content: this.documentContent,
      status: 'Under Review',
      author: this.authService.getUsername(),
    };

    this.documentService.createDocument(doc).subscribe({
      next: () => {
        alert('Document submitted for review');
        this.documentTitle = '';
        this.documentContent = '';
        this.router.navigate(['/author-dashboard']);
      },
      error: () => alert('Failed to send for review'),
    });
  }
}
