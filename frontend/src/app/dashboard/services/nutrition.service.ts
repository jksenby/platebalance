import { inject, Injectable } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { NutritionCalculation } from '../models/nutrition.model';

@Injectable({ providedIn: 'root' })
export class NutritionService {
  private readonly api = inject(ApiService);

  public calculate() {
    return this.api.get<NutritionCalculation>('/nutrition/calculate');
  }
}
