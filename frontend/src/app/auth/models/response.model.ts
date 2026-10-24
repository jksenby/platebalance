import { BaseResponse } from '../../../core/models/base.model';

export interface RegisterResponse extends BaseResponse {
    userId: string;
}

export interface CurrentUserResponse {
    email: string;
    id: string;
    firstName: string;
    dateOfBirth?: string | null;
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    physicalActivityFactor?: number | null;
}
