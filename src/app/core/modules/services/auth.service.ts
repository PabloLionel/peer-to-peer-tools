import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly router: Router,
  ) { }

  login(credentials: any) {
    return of({}).pipe(
      tap({
        next: (response) => {
          this.saveAccessToken('');
        },
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('access_token');


    this.router.navigate(['/auth']);
  }

  register(user: any) {
  }

  private saveAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }
}
