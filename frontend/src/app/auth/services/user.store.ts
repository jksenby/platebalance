import { computed, inject, Injectable, signal } from "@angular/core";
import { AuthService } from "./auth.service";
import { CurrentUserResponse } from "../models/response.model";
import { throwError } from "rxjs/internal/observable/throwError";
import { catchError } from "rxjs/internal/operators/catchError";
import { Router } from "@angular/router";
import { tap } from "rxjs/internal/operators/tap";

@Injectable({
  providedIn: "root",
})
export class UserStore {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    private _user = signal<CurrentUserResponse | null>(null);
    private _loaded = signal<boolean>(false);

    public readonly user = this._user.asReadonly();
    public readonly loaded = this._loaded.asReadonly();
    public readonly isAuthenticated = computed(() => this._user() !== null);

    public load() {
        return this.auth.getCurrentUser().pipe(
            catchError((error) => {
                this._user.set(null);
                this._loaded.set(true);
                return throwError(() => error);
            }),
            tap((user) => {
                this._user.set(user);
                this._loaded.set(true);
            })
        );
    }

    public setUser(user: CurrentUserResponse | null) {
        this._user.set(user);
        this._loaded.set(true);
    }

    public clear() {
        this._user.set(null);
        this._loaded.set(false);
    }
}