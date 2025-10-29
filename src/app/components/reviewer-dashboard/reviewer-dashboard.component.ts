import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrl: './reviewer-dashboard.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ReviewerDashboardComponent implements OnInit {
  documents: any[] = [];
  selectedDoc: any = null;
  reviewComments: string = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  // ✅ Load only documents that are ready for review
  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data.filter(
          (doc) => doc.status === 'Under Review' || doc.status === 'In Review'
        );
      },
      error: (err) => console.error('Error fetching documents:', err),
    });
  }

  // ✅ Open a document for review
  openDocument(doc: any): void {
    this.selectedDoc = doc;
    this.reviewComments = doc.reviewComments || '';
  }

  // ✅ Send document back to Author
  sendBackToAuthor(): void {
    if (!this.selectedDoc) return;

    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Needs Revision',
      reviewComments: this.reviewComments,
    };

    this.documentService
      .updateDocument(this.selectedDoc._id, updatedDoc)
      .subscribe({
        next: () => {
          alert('📤 Sent back to Author for revisions.');
          this.selectedDoc = null;
          this.reviewComments = '';
          this.loadDocuments();
        },
        error: (err) => console.error('Error sending back to author:', err),
      });
  }

  // ✅ Approve document for Approver stage
  approveForApprover(): void {
    if (!this.selectedDoc) return;

    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Awaiting Approval',
      reviewComments: this.reviewComments,
    };

    this.documentService
      .updateDocument(this.selectedDoc._id, updatedDoc)
      .subscribe({
        next: () => {
          alert('✅ Sent to Approver for final approval.');
          this.selectedDoc = null;
          this.reviewComments = '';
          this.loadDocuments();
        },
        error: (err) => console.error('Error sending to approver:', err),
      });
  }
}
