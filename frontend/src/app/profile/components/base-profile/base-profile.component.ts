import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

import { UserStore } from '../../../auth/services/user.store';

/** Карточка с основной информацией о пользователе: аватар, имя, email. */
@Component({
  selector: 'app-base-profile',
  imports: [AvatarModule],
  templateUrl: './base-profile.component.html',
  styleUrl: './base-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseProfileComponent {
  protected readonly user = inject(UserStore).user;

  protected readonly initial = computed(() => {
    const user = this.user();
    return (user?.firstName || user?.email || '?').charAt(0).toUpperCase();
  });
}
