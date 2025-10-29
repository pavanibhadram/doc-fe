import { Component } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private router: Router
  ) {}

  saveDraft() {
    const doc = {
      title: this.documentTitle,
      content: this.documentContent,
      status: 'Draft',
      createdBy: 'Author',
      createdAt: new Date(),
    };

    this.documentService.saveDocument(doc).subscribe(() => {
      alert('✅ Draft saved successfully!');
    });
  }

  sendForReview() {
    const doc = {
      title: this.documentTitle,
      content: this.documentContent,
      status: 'Under Review',
      createdBy: 'Author',
      createdAt: new Date(),
    };

    this.documentService.saveDocument(doc).subscribe(() => {
      alert('📤 Document sent for review!');
      this.router.navigate(['/author']);
    });
  }
}
