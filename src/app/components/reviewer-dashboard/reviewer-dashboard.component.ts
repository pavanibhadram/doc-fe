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

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (data: any[]) => {
        this.documents = data.filter((d) => d.status === 'Under Review');
      },
      error: (err) => console.error('Error loading documents', err),
    });
  }

  approveDocument(id: string): void {
    this.documentService
      .updateDocument(id, { status: 'Approved by Reviewer' })
      .subscribe({
        next: () => {
          alert('✅ Document approved successfully!');
          this.loadDocuments();
        },
        error: () => alert('❌ Failed to approve document.'),
      });
  }

  sendBack(id: string): void {
    this.documentService
      .updateDocument(id, { status: 'Sent Back to Author' })
      .subscribe({
        next: () => {
          alert('📨 Document sent back to Author.');
          this.loadDocuments();
        },
        error: () => alert('❌ Failed to send back document.'),
      });
  }
}
