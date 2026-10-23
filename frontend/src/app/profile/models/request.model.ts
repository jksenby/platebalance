export type Gender = 'male' | 'female';

export interface SurveyRequest {
    gender: Gender;
    age: number;
    height: number;
    weight: number;
}

export interface ProfileRequest {
    email: string;
    firstName: string;
    dateOfBirth: string;
    gender: Gender;
    age: number;
    weight: number;
    height: number;
}