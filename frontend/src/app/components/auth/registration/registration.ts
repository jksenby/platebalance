import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

import { AuthShell } from '../auth-shell/auth-shell';

type RegistrationField = 'name' | 'email' | 'password' | 'confirmPassword' | 'terms';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthShell,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  private readonly fb = inject(FormBuilder);

  protected readonly registrationForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatch },
  );

  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly loading = signal(false);

  private readonly password = toSignal(this.registrationForm.controls.password.valueChanges, {
    initialValue: '',
  });

  /** Оценка надёжности пароля: 0 — пусто, 3 — сильный. Только для индикатора. */
  protected readonly strength = computed(() => {
    const value = this.password();
    if (!value) {
      return 0;
    }

    const checks = [
      value.length >= 8,
      value.length >= 12,
      /[A-ZА-Я]/.test(value) && /[a-zа-я]/.test(value),
      /\d/.test(value),
      /[^\w\s]/.test(value),
    ].filter(Boolean).length;

    return Math.min(3, Math.max(1, checks - 1));
  });

  protected readonly strengthLabel = computed(
    () => ['', 'слабый', 'средний', 'надёжный'][this.strength()],
  );

  /** Цвет одного сегмента индикатора: закрашен, только если попадает в текущую оценку. */
  protected strengthBarClass(bar: number): string {
    if (bar > this.strength()) {
      return 'bg-slate-200 dark:bg-slate-700';
    }

    return ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'][this.strength()];
  }

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

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    // TODO: вызов сервиса регистрации
  }
}

function passwordsMatch(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return !confirmPassword || password === confirmPassword ? null : { passwordsMismatch: true };
}
