import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { form, FormField, min, max, required } from '@angular/forms/signals';

import { UserStore } from '../../../auth/services/user.store';
import { MainShellComponent } from '../../../shared/components/main-shell/main-shell.component';
import { Gender, SurveyRequest } from '../../models/request.model';
import { GENDER_OPTIONS } from '../../models/gender-options';
import {
  DEFAULT_PHYSICAL_ACTIVITY_FACTOR,
  PHYSICAL_ACTIVITY_OPTIONS,
} from '../../models/physical-activity-options';
import { ProfileService } from '../../services/profile.service';

type SurveyField = 'gender' | 'age' | 'height' | 'weight' | 'physicalActivityFactor';

/** Границы совпадают с разумными значениями для расчёта нормы калорий. */
const LIMITS = {
  age: { min: 14, max: 120 },
  height: { min: 100, max: 250 },
  weight: { min: 30, max: 300 },
};

@Component({
  selector: 'app-survey',
  imports: [
    ButtonModule,
    CardModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    TagModule,
    ToastModule,
    MainShellComponent,
    FormField,
  ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyComponent {
  private readonly profileService = inject(ProfileService);
  private readonly userStore = inject(UserStore);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  private readonly user = this.userStore.user();

  protected readonly limits = LIMITS;
  protected readonly genderOptions = GENDER_OPTIONS;
  protected readonly physicalActivityOptions = PHYSICAL_ACTIVITY_OPTIONS;

  public surveyModel = signal({
    firstName: this.user?.firstName ?? '',
    gender: this.parseGender(this.user?.gender),
    age: this.user?.age ?? null,
    height: this.user?.height ?? null,
    weight: this.user?.weight ?? null,
    physicalActivityFactor: this.user?.physicalActivityFactor ?? DEFAULT_PHYSICAL_ACTIVITY_FACTOR,
  });

  protected readonly surveyForm = form(this.surveyModel, (schemePath) => {
    required(schemePath.gender, { message: 'Это обязательное поле' });
    required(schemePath.age, { message: 'Это обязательное поле' });
    required(schemePath.firstName, { message: 'Это обязательное поле' });
    required(schemePath.physicalActivityFactor, { message: 'Выберите уровень активности' });
    min(schemePath.age, LIMITS.age.min);
    max(schemePath.age, LIMITS.age.max);
    min(schemePath.height, LIMITS.height.min);
    max(schemePath.height, LIMITS.height.max);
    min(schemePath.weight, LIMITS.weight.min);
    max(schemePath.weight, LIMITS.weight.max);
  });

  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);

  /** Показывать ошибку, только когда поле трогали или форму уже отправляли. */
  protected isInvalid(field: SurveyField): boolean {
    const control = this.surveyForm[field]();
    return control.invalid() && (control.touched() || this.submitted());
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.surveyForm().invalid()) {
      this.surveyForm().markAsTouched();
      return;
    }

    const request = this.surveyModel() as SurveyRequest;
    this.loading.set(true);

    this.profileService
      .saveSurvey(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          const user = this.userStore.user();
          if (user) {
            this.userStore.setUser({ ...user, ...request });
          }
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Не удалось сохранить анкету' });
          console.error('Survey error:', err);
        },
      });
  }

  private parseGender(value: string | null | undefined): Gender | '' {
    const gender = value?.toLowerCase();
    return gender === 'male' || gender === 'female' ? gender : '';
  }
}
