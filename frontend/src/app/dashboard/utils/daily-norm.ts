import { CurrentUserResponse } from '../../auth/models/response.model';

export interface DailyNorm {
  /** Базовый обмен веществ, ккал. */
  bmr: number;
  /** Суточная норма с учётом активности, ккал. */
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Уровня активности в анкете пока нет — считаем по «лёгкой активности». */
const ACTIVITY_FACTOR = 1.375;

/** Доли калорий на белки, жиры и углеводы. */
const MACRO_SPLIT = { protein: 0.25, fat: 0.3, carbs: 0.45 };

const KCAL_PER_GRAM = { protein: 4, fat: 9, carbs: 4 };

/**
 * Суточная норма по формуле Миффлина — Сан Жеора.
 * Возвращает null, если в анкете не хватает данных для расчёта.
 */
export function calculateDailyNorm(user: CurrentUserResponse | null): DailyNorm | null {
  const { age, height, weight } = user ?? {};
  const gender = user?.gender?.toLowerCase();

  if (!age || !height || !weight || (gender !== 'male' && gender !== 'female')) {
    return null;
  }

  const bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
  const calories = bmr * ACTIVITY_FACTOR;

  return {
    bmr: Math.round(bmr),
    calories: Math.round(calories),
    protein: Math.round((calories * MACRO_SPLIT.protein) / KCAL_PER_GRAM.protein),
    fat: Math.round((calories * MACRO_SPLIT.fat) / KCAL_PER_GRAM.fat),
    carbs: Math.round((calories * MACRO_SPLIT.carbs) / KCAL_PER_GRAM.carbs),
  };
}
