import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';

import { UserStore } from '../../../auth/services/user.store';
import { MainShellComponent } from '../../../shared/components/main-shell/main-shell.component';
import { Gender, SurveyRequest } from '../../models/request.model';
import { ProfileService } from '../../services/profile.service';

type SurveyField = 'gender' | 'age' | 'height' | 'weight';

/** Границы совпадают с разумными значениями для расчёта нормы калорий. */
const LIMITS = {
  age: { min: 14, max: 120 },
  height: { min: 100, max: 250 },
  weight: { min: 30, max: 300 },
};

@Component({
  selector: 'app-survey',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputNumberModule,
    SelectButtonModule,
    ToastModule,
    MainShellComponent,
  ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly userStore = inject(UserStore);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly limits = LIMITS;

  protected readonly genderOptions: { label: string; value: Gender }[] = [
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
  ];

  /** Если анкету уже заполняли — подставляем сохранённые значения. */
  private readonly user = this.userStore.user();

  protected readonly surveyForm = this.fb.group({
    gender: [this.parseGender(this.user?.gender), Validators.required],
    age: [
      this.user?.age ?? null,
      [Validators.required, Validators.min(LIMITS.age.min), Validators.max(LIMITS.age.max)],
    ],
    height: [
      this.user?.height ?? null,
      [Validators.required, Validators.min(LIMITS.height.min), Validators.max(LIMITS.height.max)],
    ],
    weight: [
      this.user?.weight ?? null,
      [Validators.required, Validators.min(LIMITS.weight.min), Validators.max(LIMITS.weight.max)],
    ],
  });

  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);

  /** Показывать ошибку, только когда поле трогали или форму уже отправляли. */
  protected isInvalid(field: SurveyField): boolean {
    const control = this.surveyForm.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }

    const request = this.surveyForm.getRawValue() as SurveyRequest;
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

  private parseGender(value: string | null | undefined): Gender | null {
    const gender = value?.toLowerCase();
    return gender === 'male' || gender === 'female' ? gender : null;
  }
}
