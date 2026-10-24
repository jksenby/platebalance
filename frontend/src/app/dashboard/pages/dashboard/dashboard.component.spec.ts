import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { UserStore } from '../../../auth/services/user.store';
import { NutritionCalculation } from '../../models/nutrition.model';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let http: HttpTestingController;

  const calculation: NutritionCalculation = {
    bmr: 1700, dailyCalories: 2635, protein: 198, fat: 73, carbs: 296,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    TestBed.inject(UserStore).setUser({
      id: 'test-user', email: 'alex@example.com', firstName: 'Alex', gender: 'male',
      age: 28, height: 178, weight: 72, physicalActivityFactor: 1.55,
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function render(): void {
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  }

  it('shows loading, then displays the server calculation including separate BMR', async () => {
    render();
    expect(fixture.nativeElement.textContent).toContain('Рассчитываем вашу норму');
    const request = http.expectOne('/nutrition/calculate');
    expect(request.request.method).toBe('GET');
    request.flush(calculation);
    await fixture.whenStable();

    const hero = fixture.nativeElement.querySelector('.calories .value') as HTMLElement;
    expect(hero.textContent?.replace(/\s/g, '')).toBe('2635ккал');
    const tiles = Array.from(fixture.nativeElement.querySelectorAll('.tiles dd'))
      .map((item) => (item as HTMLElement).textContent?.replace(/\s/g, ''));
    expect(tiles).toEqual(['2635ккал', '1700ккал']);
    expect(fixture.nativeElement.querySelectorAll('app-nutrient-meter').length).toBe(4);
    expect(fixture.nativeElement.textContent).not.toContain('Рассчитываем вашу норму');
  });

  it('invites a user with an incomplete survey to complete it without requesting a calculation', () => {
    TestBed.inject(UserStore).setUser({
      id: 'new-user', email: 'new@example.com', firstName: 'New',
    });
    render();
    http.expectNone('/nutrition/calculate');
    expect(fixture.nativeElement.textContent).toContain('Рассчитаем вашу норму');
    const action = fixture.debugElement.query(By.css('.survey-cta p-button'));
    const link = action.injector.get(RouterLink);
    expect(TestBed.inject(Router).serializeUrl(link.urlTree!)).toBe('/survey');
  });

  it('shows a request error separately from an incomplete survey and allows retrying', async () => {
    render();
    http.expectOne('/nutrition/calculate').flush({}, { status: 500, statusText: 'Server error' });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Не удалось загрузить норму калорий');
    expect(fixture.nativeElement.textContent).not.toContain('Рассчитаем вашу норму');

    (fixture.nativeElement.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    http.expectOne('/nutrition/calculate').flush(calculation);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.calories')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
