import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';

import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, ButtonModule, InputTextModule, MessageModule, PasswordModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);

  /** Показывать ошибку, только когда поле трогали или форму уже отправляли. */
  protected isInvalid(field: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.loading.set(true);

    this.authService
      .login({ email, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          console.log('Login successful');
        },
        error: (err) => {
          if (err.status === 401) {
            this.messageService.add({ severity: 'error', summary: 'Неверный email или пароль' });
          } else {
            this.messageService.add({ severity: 'error', summary: err.message });
          }
          console.error('Login error:', err);
        },
      });
  }
}
