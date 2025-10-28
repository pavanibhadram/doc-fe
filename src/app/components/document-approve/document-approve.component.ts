import { Component } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-approve',
  templateUrl: './document-approve.component.html',
  styleUrl: './document-approve.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DocumentApproveComponent {
  approvedDocs: any[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadApprovedDocuments();
  }

  // ✅ Load signed documents
  loadApprovedDocuments() {
    this.documentService.getDocuments().subscribe((allDocs: any[]) => {
      this.approvedDocs = allDocs.filter(
        (d: any) => d.status === 'Approved & Signed'
      );
    });
  }

  // ✅ Generate downloadable PDF
  downloadPDF(doc: any) {
    const content = `
      Title: ${doc.title}
      Created By: ${doc.createdBy}
      Approved By: ${doc.approvedBy}
      Status: ${doc.status}
      Signature: ${doc.signature}

      ------------------------
      Content:
      ${doc.content}
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ✅ Placeholder for Google Drive upload
  uploadToGoogleDrive(doc: any) {
    alert(
      `"${doc.title}" will be uploaded to Google Drive folder for signed documents.`
    );
  }
}
