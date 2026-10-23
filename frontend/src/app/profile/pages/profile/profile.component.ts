import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { GENDER_OPTIONS } from '../../models/gender-options';
import { UserStore } from '../../../auth/services/user.store';
import { Gender, ProfileRequest } from '../../models/request.model';
import { ProfileService } from '../../services/profile.service';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { format } from 'date-fns';


@Component({
  selector: 'app-profile',
  imports: [
    ButtonModule, CardModule, DatePickerModule, FieldsetModule,
    InputNumberModule, InputTextModule, SelectModule, TagModule,
    MainShellComponent, BaseProfileComponent, FormField,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly userStore = inject(UserStore);
  private readonly profileService = inject(ProfileService);
  private readonly messageService = inject(MessageService);
  
  public readonly genderOptions = GENDER_OPTIONS;

  private readonly user = this.userStore.user();

  public readonly loading = signal(false);

  public readonly profileModel = signal({
    email: this.user?.email || '',
    firstName: this.user?.firstName || '',
    dateOfBirth: this.user?.dateOfBirth ? new Date(this.user.dateOfBirth) : new Date(),
    gender: (this.user?.gender || 'male') as Gender,
    age: this.user?.age || 0,
    weight: this.user?.weight || 0,
    height: this.user?.height || 0,
  });

  public readonly profileForm = form(this.profileModel, (path) => {
    min(path.age, 1);
    max(path.age, 120);
    min(path.height, 1);
    max(path.height, 300);
    min(path.weight, 1);
    max(path.weight, 700);
  });

  public onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.profileForm().invalid()) {
      this.profileForm().markAsTouched();
      return;
    }
    
    const model = this.profileModel();
    const request: ProfileRequest = {
      ...model,
      dateOfBirth: format(model.dateOfBirth, 'yyyy-MM-dd'),
    };
    this.profileService
          .saveProfile(request)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              const user = this.userStore.user();
              if (user) {
                this.userStore.setUser({ ...user, ...request, dateOfBirth: request.dateOfBirth });
              }
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Не удалось сохранить анкету' });
              console.error('Survey error:', err);
            },
          });
  }
}
