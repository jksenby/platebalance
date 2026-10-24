import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { provideHttpClient } from '@angular/common/http';

import { SurveyComponent } from './survey.component';

describe('SurveyComponent', () => {
  let component: SurveyComponent;
  let fixture: ComponentFixture<SurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyComponent],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('enforces numeric limits and validates an empty field through PrimeNG', async () => {
    const input = fixture.nativeElement.querySelector('p-inputnumber input') as HTMLInputElement;
    input.value = '13';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(component.surveyModel().age).toBe(14);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(component.surveyModel().age).toBeNull();
    const field = input.closest('label')!;
    expect(field.querySelector('p-message')).not.toBeNull();
    expect(input.classList.contains('p-invalid')).toBeTrue();
  });

  it('submits the values bound to PrimeNG without a native page submission', async () => {
    const save = spyOn(TestBed.inject(ProfileService), 'saveSurvey')
      .and.returnValue(of({ success: true, message: '' }));
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const values = {
      firstName: 'Alex', gender: 'male' as const, age: 28, height: 178.5, weight: 72.5,
      physicalActivityFactor: 1.55,
    };
    component.surveyModel.set(values);
    await fixture.whenStable();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    await fixture.whenStable();

    expect(event.defaultPrevented).toBeTrue();
    expect(save).toHaveBeenCalledOnceWith(values);
  });

  it('updates activity through the PrimeNG select', async () => {
    const control = fixture.nativeElement.querySelectorAll('p-select')[1] as HTMLElement;
    control.click();
    await fixture.whenStable();
    const option = Array.from(fixture.nativeElement.querySelectorAll('[role="option"]'))
      .find((item) => (item as HTMLElement).textContent?.includes('Средняя')) as HTMLElement;
    expect(option).toBeTruthy();
    option.click();
    await fixture.whenStable();

    expect(component.surveyModel().physicalActivityFactor).toBe(1.55);
  });
});
