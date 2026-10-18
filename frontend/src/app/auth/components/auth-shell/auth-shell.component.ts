import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BrandComponent } from '../../../shared/components/brand/brand.component';

/** Презентационный каркас страниц авторизации: логотип и карточка с формой. */
@Component({
  selector: 'app-auth-shell',
  imports: [BrandComponent],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {}
