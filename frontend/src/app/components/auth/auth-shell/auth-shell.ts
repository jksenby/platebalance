import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AuthFeature {
  icon: string;
  title: string;
  text: string;
}

/**
 * Презентационный каркас страниц авторизации: брендовая половина слева
 * и карточка с формой справа. Содержимое карточки передаётся через слот.
 */
@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShell {
  protected readonly features: AuthFeature[] = [
    {
      icon: 'pi pi-chart-pie',
      title: 'Баланс тарелки',
      text: 'Белки, жиры и углеводы в наглядных пропорциях',
    },
    {
      icon: 'pi pi-wave-pulse',
      title: 'Динамика без таблиц',
      text: 'Вес, калории и привычки на одном графике',
    },
    {
      icon: 'pi pi-sparkles',
      title: 'Персональные нормы',
      text: 'Короткий опрос — и план питания под вашу цель',
    },
  ];

  protected readonly year = new Date().getFullYear();
}
