import { inject, Injectable } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { SurveyRequest } from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly api = inject(ApiService);

  /** Эндпоинта на бэкенде пока нет. */
  public saveSurvey(request: SurveyRequest) {
    return this.api.put('/auth/me/profile', request);
  }
}
