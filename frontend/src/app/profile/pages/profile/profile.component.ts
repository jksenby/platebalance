import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { form, FormField, max, min } from '@angular/forms/signals';
import { MainShellComponent } from '../../../shared/components/main-shell/main-shell.component';
import { BaseProfileComponent } from '../../components/base-profile/base-profile.component';
import { ProfileForm } from '../../models/profile-form.model';
import { GENDER_OPTIONS } from '../../models/gender-options';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink, ButtonModule, CardModule, DatePickerModule, FieldsetModule,
    InputNumberModule, InputTextModule, SelectModule, TagModule,
    MainShellComponent, BaseProfileComponent, FormField,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected readonly genderOptions = GENDER_OPTIONS;

  protected readonly profileModel = signal<ProfileForm>({
    email: '',
    username: '',
    firstName: '',
    dateOfBirth: new Date(),
    gender: '',
    age: 0,
    weight: 0,
    height: 0,
  });

  protected readonly profileForm = form(this.profileModel, (path) => {
    min(path.age, 1);
    max(path.age, 120);
    min(path.height, 1);
    max(path.height, 300);
    min(path.weight, 1);
    max(path.weight, 700);
  });
}
