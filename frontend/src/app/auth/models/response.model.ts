import { BaseResponse } from '../../core/models/base.model';

export interface RegisterResponse extends BaseResponse {
    userId: string;
}

/** /auth/me не возвращает success/message — форма своя. */
export interface CurrentUserResponse {
    email: string;
    id: string;
}
