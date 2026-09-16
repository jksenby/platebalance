import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

import { AuthShell } from '../auth-shell/auth-shell';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthShell,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true],
  });

  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly loading = signal(false);

  /** Показывать ошибку, только когда поле трогали или форму уже отправляли. */
  protected isInvalid(field: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.loginForm.getRawValue();
    this.authService.login({ email, password })
    .pipe(
      finalize(() => this.loading.set(false))
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        if(err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Неверный email или пароль' });
        } else {
          this.messageService.add({ severity: 'error', summary: err.message });
        }
        console.error('Login error:', err);
      }
    });
  }
}
