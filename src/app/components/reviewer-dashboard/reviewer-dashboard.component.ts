import { Component } from '@angular/core';
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
export class ReviewerDashboardComponent {
  documents: any[] = [];
  selectedDoc: any = null;
  reviewComment = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  // ✅ Fetch documents from backend and filter "Under Review"
  loadDocuments() {
    this.documentService.getDocuments().subscribe((allDocs: any[]) => {
      this.documents = allDocs.filter((d: any) => d.status === 'Under Review');
    });
  }

  openDocument(doc: any) {
    this.selectedDoc = doc;
    this.reviewComment = '';
  }

  sendBackToAuthor() {
    this.updateStatus('Changes Requested');
  }

  sendToApprover() {
    this.updateStatus('Approved by Reviewer');
  }

  // ✅ Update document with new status and review comment
  updateStatus(newStatus: string) {
    if (!this.selectedDoc) return;

    const updatedDoc = {
      ...this.selectedDoc,
      status: newStatus,
      reviewComment: this.reviewComment,
    };

    this.documentService.saveDocument(updatedDoc).subscribe(() => {
      alert(
        `Document ${
          newStatus === 'Changes Requested'
            ? 'sent back to Author'
            : 'sent to Approver'
        }!`
      );
      this.selectedDoc = null;
      this.loadDocuments();
    });
  }
}
