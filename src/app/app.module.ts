import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthorDashboardComponent } from './components/author-dashboard/author-dashboard.component';
import { ReviewerDashboardComponent } from './components/reviewer-dashboard/reviewer-dashboard.component';
import { ApproverDashboardComponent } from './components/approver-dashboard/approver-dashboard.component';
import { DocumentCreateComponent } from './components/document-create/document-create.component';
import { DocumentApproveComponent } from './components/document-approve/document-approve.component';
import { DocumentReviewComponent } from './components/document-review/document-review.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, LoginComponent, DocumentReviewComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
