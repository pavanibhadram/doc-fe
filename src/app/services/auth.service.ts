import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // store user object { username: 'Author' } in localStorage on login
  setLoggedInUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getLoggedInUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  getUsername(): string {
    const u = this.getLoggedInUser();
    return u ? u.username : 'Author';
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
