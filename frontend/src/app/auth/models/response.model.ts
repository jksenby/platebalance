import { BaseResponse } from '../../../core/models/base.model';

export interface RegisterResponse extends BaseResponse {
    userId: string;
}

/** /auth/me не возвращает success/message — форма своя. */
export interface CurrentUserResponse {
    email: string;
    id: string;
    firstName: string;
    /** Поля анкеты: есть в модели User на бэкенде, но /auth/me их пока не отдаёт. */
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
}
