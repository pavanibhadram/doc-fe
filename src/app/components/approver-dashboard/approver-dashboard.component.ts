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
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  // ✅ Load documents pending final approval
  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs.filter(
          (doc) => doc.status === 'Approved by Reviewer'
        );
      },
      error: () => this.showMessage('Failed to load documents.', 'error'),
    });
  }

  // ✅ Open a specific document for approval
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
          this.showMessage('Document sent back to reviewer!', 'success');
          this.resetForm();
          this.loadDocuments();
        },
        error: () => this.showMessage('Failed to send back document.', 'error'),
      });
  }

  // ✅ Approve & digitally sign document
  approveAndSign() {
    if (!this.selectedDoc || !this.digitalSignature.trim()) {
      this.showMessage(
        'Please add your digital signature before approving.',
        'error'
      );
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
          this.showMessage(
            '✅ Document approved and signed successfully!',
            'success'
          );
          this.resetForm();
          this.loadDocuments();
        },
        error: () => this.showMessage('Failed to approve document.', 'error'),
      });
  }

  // ✅ Close current document view
  closeDocument() {
    this.selectedDoc = null;
    this.digitalSignature = '';
    this.approvalComment = '';
  }

  // ✅ Reset after action
  private resetForm() {
    this.selectedDoc = null;
    this.digitalSignature = '';
    this.approvalComment = '';
  }

  // ✅ Show inline message
  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
