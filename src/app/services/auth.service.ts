import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInUser: any = null;

  constructor(private router: Router) {}

  getLoggedInUser() {
    if (!this.loggedInUser) {
      const user = localStorage.getItem('user');
      if (user) {
        this.loggedInUser = JSON.parse(user);
      }
    }
    return this.loggedInUser;
  }

  // ✅ Add this method
  getUsername(): string {
    const user = this.getLoggedInUser();
    return user ? user.username : '';
  }

  logout() {
    this.loggedInUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
