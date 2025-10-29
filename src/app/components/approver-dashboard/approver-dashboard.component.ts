import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approver-dashboard',
  templateUrl: './approver-dashboard.component.html',
  styleUrl: './approver-dashboard.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ApproverDashboardComponent implements OnInit {
  documents: any[] = [];
  selectedDoc: any = null;
  digitalSignature: string = '';
  approvalComment: string = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  // ✅ Load documents from backend
  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        // Filter documents that are awaiting approval
        this.documents = docs.filter(
          (doc) => doc.status === 'Approved by Reviewer'
        );
      },
      error: (err) => console.error('Error loading documents:', err),
    });
  }

  openDocument(doc: any) {
    this.selectedDoc = doc;
  }

  // 🔙 Send document back to reviewer
  sendBackToReviewer() {
    if (!this.selectedDoc) return;
    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Sent Back to Reviewer',
      approvalComment: this.approvalComment || 'Please revise and resubmit.',
    };

    this.documentService
      .updateDocument(this.selectedDoc._id, updatedDoc)
      .subscribe({
        next: () => {
          alert('Document sent back to reviewer!');
          this.selectedDoc = null;
          this.loadDocuments();
        },
        error: (err) => console.error('Error sending back document:', err),
      });
  }

  // ✅ Approve & digitally sign document
  approveAndSign() {
    if (!this.selectedDoc || !this.digitalSignature.trim()) {
      alert('Please add your digital signature before approving.');
      return;
    }

    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Approved & Signed',
      approvalComment: this.approvalComment || 'Approved by Approver',
      digitalSignature: this.digitalSignature,
    };

    this.documentService
      .updateDocument(this.selectedDoc._id, updatedDoc)
      .subscribe({
        next: () => {
          alert('✅ Document approved and signed successfully!');
          this.selectedDoc = null;
          this.digitalSignature = '';
          this.approvalComment = '';
          this.loadDocuments();
        },
        error: (err) => console.error('Error approving document:', err),
      });
  }
}
