export type Gender = 'male' | 'female';

export interface SurveyRequest {
    gender: Gender;
    age: number;
    height: number;
    weight: number;
}
