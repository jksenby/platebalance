import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/base.model';

export interface ApiOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  context?: HttpContext;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  public get<T = BaseResponse>(url: string, options?: ApiOptions): Observable<T> {
    return this.http.get<T>(url, options);
  }

  public post<T = BaseResponse>(url: string, body: unknown = null, options?: ApiOptions): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  public put<T = BaseResponse>(url: string, body: unknown = null, options?: ApiOptions): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  public patch<T = BaseResponse>(url: string, body: unknown = null, options?: ApiOptions): Observable<T> {
    return this.http.patch<T>(url, body, options);
  }

  public delete<T = BaseResponse>(url: string, options?: ApiOptions): Observable<T> {
    return this.http.delete<T>(url, options);
  }
}
