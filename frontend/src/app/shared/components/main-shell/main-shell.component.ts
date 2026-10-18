import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../../auth/services/auth.service';
import { UserStore } from '../../../auth/services/user.store';
import { BrandComponent } from '../brand/brand.component';

/** Каркас страниц для авторизованного пользователя: шапка с логотипом и выходом, контент по центру. */
@Component({
  selector: 'app-main-shell',
  imports: [BrandComponent, ButtonModule],
  templateUrl: './main-shell.component.html',
  styleUrl: './main-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainShellComponent {
  private readonly authService = inject(AuthService);
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);

  protected readonly loggingOut = signal(false);

  protected logout(): void {
    this.loggingOut.set(true);

    this.authService
      .logout()
      .pipe(finalize(() => this.loggingOut.set(false)))
      .subscribe({
        next: () => {
          this.userStore.clear();
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Logout error:', err),
      });
  }
}
