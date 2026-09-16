import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core/primitives/di';
import { catchError, map, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.getCurrentUser().pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout(); 
        
        router.navigate(['/login']); 
      }
      return throwError(() => error);
    }),
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']); 
        return false;
      }
    })
  )
};
