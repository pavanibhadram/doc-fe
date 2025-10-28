import { Component } from '@angular/core';
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
export class ApproverDashboardComponent {
  documents: any[] = [];
  selectedDoc: any = null;
  digitalSignature = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  // ✅ Use subscribe() to fetch and filter documents
  loadDocuments() {
    this.documentService.getDocuments().subscribe((allDocs: any[]) => {
      this.documents = allDocs.filter(
        (d: any) => d.status === 'Approved by Reviewer'
      );
    });
  }

  openDocument(doc: any) {
    this.selectedDoc = doc;
    this.digitalSignature = '';
  }

  // ✅ Approve and sign document
  approveAndSign() {
    if (!this.digitalSignature.trim()) {
      alert('Please enter your digital signature before approving.');
      return;
    }

    if (!this.selectedDoc) return;

    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Approved & Signed',
      approvedBy: 'Approver',
      signature: this.digitalSignature,
      approvedAt: new Date().toISOString(),
    };

    this.documentService.saveDocument(updatedDoc).subscribe(() => {
      alert('Document Approved and Digitally Signed!');
      this.selectedDoc = null;
      this.loadDocuments();
    });
  }

  // ✅ Send document back to reviewer
  sendBackToReviewer() {
    if (!this.selectedDoc) return;

    const updatedDoc = {
      ...this.selectedDoc,
      status: 'Sent Back to Reviewer',
    };

    this.documentService.saveDocument(updatedDoc).subscribe(() => {
      alert('Document sent back to Reviewer!');
      this.selectedDoc = null;
      this.loadDocuments();
    });
  }
}
