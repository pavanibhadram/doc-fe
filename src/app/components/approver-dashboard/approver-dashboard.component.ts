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
  digitalSignature = '';
  approvalComment = '';
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (docs: any[]) => {
        // documents that were forwarded to approver by reviewer
        this.documents = docs.filter(
          (doc) => doc.status === 'Under Approver Review'
        );
      },
      error: (err) => {
        console.error('Error loading documents', err);
        this.showMessage('Failed to load documents.', 'error');
      },
    });
  }

  openDocument(doc: any): void {
    this.selectedDoc = doc;
    this.digitalSignature = '';
    this.approvalComment = '';
  }

  sendBackToReviewer(): void {
    if (!this.selectedDoc) return;
    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Sent Back to Reviewer',
      reviewComment: this.approvalComment || 'Please revise and resubmit.',
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

  approveAndSign(): void {
    if (!this.selectedDoc) return;
    if (!this.digitalSignature.trim()) {
      this.showMessage(
        'Please add your digital signature before approving.',
        'error'
      );
      return;
    }

    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Approved & Signed',
      approvedBy: 'Approver', // or use real logged-in name
      signature: this.digitalSignature,
      reviewComment: this.approvalComment || 'Approved',
    };

    this.documentService
      .updateDocument(this.selectedDoc._id, updatedDoc)
      .subscribe({
        next: () => {
          this.showMessage(
            'Document approved and signed successfully!',
            'success'
          );
          this.resetForm();
          this.loadDocuments();
        },
        error: () => this.showMessage('Failed to approve document.', 'error'),
      });
  }

  closeDocument(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedDoc = null;
    this.digitalSignature = '';
    this.approvalComment = '';
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
  finalApprove(doc: any) {
    const signature = 'Pavani Signature';
    const comment = prompt('Enter comment (optional)') || '';

    // this.documentService.finalApprove(doc._id, signature, comment).subscribe(
    //   (res: any) => {
    //     alert('Final approved + uploaded to Google Drive ✅');
    //     this.loadDocuments(); // <--- HERE FIXED
    //   },
    //   (err) => {
    //     console.log(err);
    //     alert('Error in final approve');
    //   }
    //);
  }
}
