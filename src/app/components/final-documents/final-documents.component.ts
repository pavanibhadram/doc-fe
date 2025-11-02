import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-final-documents',
  templateUrl: './final-documents.component.html',
  styleUrl: './final-documents.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FinalDocumentsComponent implements OnInit {
  documents: any[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadFinalDocuments();
  }

  loadFinalDocuments(): void {
    this.loading = true;
    this.documentService.getDocuments().subscribe({
      next: (docs: any[]) => {
        // show only Approved & Signed documents
        this.documents = (docs || []).filter(
          (d) => d.status === 'Approved & Signed'
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading final documents', err);
        this.showMessage('Failed to load final documents.', 'error');
        this.loading = false;
      },
    });
  }

  // Download a simple text-based PDF (placeholder)
  downloadPDF(doc: any): void {
    const content = `
Title: ${doc.title}
Status: ${doc.status}
Approved By: ${doc.approvedBy || 'N/A'}
Signature: ${doc.signature || 'N/A'}

-------------------------
Content:
${doc.content}
    `;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(doc.title || 'document').replace(/\s+/g, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  viewDetails(doc: any): void {
    // Simple inline alert detail - you can replace with a modal later
    const details = [
      `Title: ${doc.title}`,
      `Status: ${doc.status}`,
      `Approved By: ${doc.approvedBy || 'N/A'}`,
      `Signature: ${doc.signature || 'N/A'}`,
      '',
      `Content:\n${doc.content}`,
    ].join('\n');
    alert(details);
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }
}
