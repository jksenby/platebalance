import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if(route.queryParamMap.get('token')) return false;
  return true;
};
