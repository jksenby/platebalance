import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { UserStore } from '../../../auth/services/user.store';
import { MainShellComponent } from '../../../shared/components/main-shell/main-shell.component';
import { BaseProfileComponent } from '../../components/base-profile/base-profile.component';

interface ProfileStat {
  label: string;
  value: string | null;
  unit?: string;
}

const GENDER_LABELS: Record<string, string> = {
  male: 'Мужской',
  female: 'Женский',
};

@Component({
  selector: 'app-profile',
  imports: [RouterLink, ButtonModule, MainShellComponent, BaseProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly user = inject(UserStore).user;

  /** Анкета считается заполненной, когда известны рост и вес — без них не посчитать норму. */
  protected readonly surveyCompleted = computed(() => {
    const user = this.user();
    return user?.height != null && user?.weight != null;
  });

  protected readonly stats = computed<ProfileStat[]>(() => {
    const user = this.user();
    const height = user?.height ?? null;
    const weight = user?.weight ?? null;
    const gender = user?.gender ?? null;
    const bmi = height && weight ? (weight / (height / 100) ** 2).toFixed(1) : null;

    return [
      { label: 'Возраст', value: user?.age?.toString() ?? null, unit: 'лет' },
      { label: 'Пол', value: gender && (GENDER_LABELS[gender.toLowerCase()] ?? gender) },
      { label: 'Рост', value: height?.toString() ?? null, unit: 'см' },
      { label: 'Вес', value: weight?.toString() ?? null, unit: 'кг' },
      { label: 'ИМТ', value: bmi },
    ];
  });
}
