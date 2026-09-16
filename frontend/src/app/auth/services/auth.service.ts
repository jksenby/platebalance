import { inject, Injectable } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../models/request.model';
import { CurrentUserResponse, RegisterResponse } from '../models/response.model';
import { ApiService } from '../../../core/services/api.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  public login(request: LoginRequest) {
    return this.api.post('/identity/login', request, {
      params: { useCookies: true },
    });
  }

  public logout() {
    return this.api.post('/auth/logout');
  }

  public getCurrentUser() {
    return this.api.get<CurrentUserResponse>('/auth/me').pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
    );
  }

  public register(request: RegisterRequest) {
    return this.api.post<RegisterResponse>('/auth/register', request);
  }
}
