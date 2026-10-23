import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from 'primeng/card';

import { BrandComponent } from '../../../shared/components/brand/brand.component';

/** Презентационный каркас страниц авторизации: логотип и карточка с формой. */
@Component({
  selector: 'app-auth-shell',
  imports: [CardModule, BrandComponent],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {}
