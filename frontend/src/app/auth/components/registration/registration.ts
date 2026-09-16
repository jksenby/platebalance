import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';

import { AuthShell } from '../auth-shell/auth-shell';
import { AuthService } from '../../services/auth.service';

type RegistrationField = 'name' | 'email' | 'password' | 'confirmPassword';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink, AuthShell, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly registrationForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);

  protected isInvalid(field: RegistrationField): boolean {
    const control: AbstractControl = this.registrationForm.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  /** Пароли не совпадают — ошибка живёт на форме, а показываем её под вторым полем. */
  protected get mismatch(): boolean {
    const control = this.registrationForm.controls.confirmPassword;
    return (
      this.registrationForm.hasError('passwordsMismatch') &&
      control.valid &&
      (control.touched || this.submitted())
    );
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registrationForm.getRawValue();
    this.loading.set(true);

    this.authService
      .register({ firstName: name, email, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: response.message });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.messageService.add({ severity: 'error', summary: err.error.message });
        },
      });
  }
}

function passwordsMatch(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return !confirmPassword || password === confirmPassword ? null : { passwordsMismatch: true };
}
