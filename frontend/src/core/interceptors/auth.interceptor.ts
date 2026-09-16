import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let clonedRequest = req.clone({
    withCredentials: true
  });

  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    clonedRequest = clonedRequest.clone({
      url: `${environment.apiUrl}${req.url}`
    });
  }

  return next(clonedRequest);
};
