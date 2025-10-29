import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DocumentCreateComponent } from './components/document-create/document-create.component';
import { ReviewerDashboardComponent } from './components/reviewer-dashboard/reviewer-dashboard.component';
import { ApproverDashboardComponent } from './components/approver-dashboard/approver-dashboard.component';
import { roleGuard } from './guards/role.guard';
import { DocumentApproveComponent } from './components/document-approve/document-approve.component';
import { AuthorDashboardComponent } from './components/author-dashboard/author-dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'document-create', component: DocumentCreateComponent },
  { path: 'reviewer-dashboard', component: ReviewerDashboardComponent },
  {
    path: 'approver-dashboard',
    component: ApproverDashboardComponent,
    canActivate: [roleGuard],
  },
  {
    path: 'document-approve',
    component: DocumentApproveComponent,
    canActivate: [roleGuard],
  },
  { path: 'author-dashboard', component: AuthorDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
