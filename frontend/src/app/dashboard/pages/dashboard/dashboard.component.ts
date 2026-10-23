import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { UserStore } from '../../../auth/services/user.store';
import { MainShellComponent } from '../../../shared/components/main-shell/main-shell.component';
import { NutrientMeterComponent } from '../../components/nutrient-meter/nutrient-meter.component';
import { calculateDailyNorm } from '../../utils/daily-norm';

interface Intake {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Приёмов пищи на бэкенде пока нет, поэтому съеденное за день — нули. */
const EMPTY_INTAKE: Intake = { calories: 0, protein: 0, fat: 0, carbs: 0 };

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, RouterLink, ButtonModule, MainShellComponent, NutrientMeterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly user = inject(UserStore).user;

  protected readonly norm = computed(() => calculateDailyNorm(this.user()));
  protected readonly intake = computed<Intake>(() => EMPTY_INTAKE);

  protected readonly today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  protected readonly remaining = computed(() => {
    const norm = this.norm();
    return norm ? norm.calories - this.intake().calories : 0;
  });

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    const name = this.user()?.firstName;
    const base = hour < 6 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
    return name ? `${base}, ${name}` : base;
  });

  protected format(value: number): string {
    return value.toLocaleString('ru-RU');
  }
}
