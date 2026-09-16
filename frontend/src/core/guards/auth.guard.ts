import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core/primitives/di';
import { UserStore } from '../../app/auth/services/user.store';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(UserStore);

  if(store.loaded()) {
    return store.isAuthenticated() || router.createUrlTree(['/login']);
  }

  return store.load().pipe(
    map(() => true),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })  
  )
};
