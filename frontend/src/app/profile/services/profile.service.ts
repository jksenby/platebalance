import { inject, Injectable } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { ProfileRequest, SurveyRequest } from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly api = inject(ApiService);

  public saveSurvey(request: SurveyRequest) {
    return this.api.put('/profile/update', request);
  }

  public saveProfile(request: ProfileRequest) {
    return this.api.put('/profile/update', request);
  }

  public deleteProfile() {
    return this.api.delete('/profile/delete');
  }
}
