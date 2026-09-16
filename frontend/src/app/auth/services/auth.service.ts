import { inject, Injectable } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../models/request.model';
import { CurrentUserResponse, RegisterResponse } from '../models/response.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  public login(request: LoginRequest) {
    return this.api.post('/identity/login', request, {
      params: { useCookies: true },
    });
  }

  public logout() {
    return this.api.post('/auth/logout');
  }

  public getCurrentUser() {
    return this.api.get<CurrentUserResponse>('/auth/me');
  }

  public register(request: RegisterRequest) {
    return this.api.post<RegisterResponse>('/auth/register', request);
  }
}
