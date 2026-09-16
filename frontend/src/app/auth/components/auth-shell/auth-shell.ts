import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Презентационный каркас страниц авторизации: логотип и карточка с формой. */
@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShell {}
