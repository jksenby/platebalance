import { Component, inject } from '@angular/core';
import { UserStore } from '../../../auth/services/user.store';

@Component({
  selector: 'app-base-profile.component',
  imports: [],
  templateUrl: './base-profile.component.html',
  styleUrl: './base-profile.component.scss',
})
export class BaseProfileComponent {
  protected readonly user = inject(UserStore).user;
}
