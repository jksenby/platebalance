import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { UserStore } from '../../../auth/services/user.store';
import { MainShellComponent } from '../../../shared/components/main-shell/main-shell.component';
import { NutrientMeterComponent } from '../../components/nutrient-meter/nutrient-meter.component';
import { NutritionCalculation } from '../../models/nutrition.model';
import { NutritionService } from '../../services/nutrition.service';

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
export class DashboardComponent implements OnInit {
  private readonly nutritionService = inject(NutritionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = inject(UserStore).user;

  protected readonly norm = signal<NutritionCalculation | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadError = signal(false);
  protected readonly intake = computed<Intake>(() => EMPTY_INTAKE);

  protected readonly today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  protected readonly remaining = computed(() => {
    const norm = this.norm();
    return norm ? norm.dailyCalories - this.intake().calories : 0;
  });

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    const name = this.user()?.firstName;
    const base = hour < 6 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
    return name ? `${base}, ${name}` : base;
  });

  public ngOnInit(): void {
    this.loadNorm();
  }

  protected loadNorm(): void {
    const user = this.user();
    const gender = user?.gender?.toLowerCase();
    // Как и раньше, незаполненная анкета показывает приглашение заполнить её.
    if (!user?.age || !user.height || !user.weight || (gender !== 'male' && gender !== 'female')) {
      this.norm.set(null);
      return;
    }

    this.loading.set(true);
    this.loadError.set(false);
    this.nutritionService
      .calculate()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (norm) => this.norm.set(norm),
        error: () => this.loadError.set(true),
      });
  }

  protected format(value: number): string {
    return value.toLocaleString('ru-RU');
  }
}
