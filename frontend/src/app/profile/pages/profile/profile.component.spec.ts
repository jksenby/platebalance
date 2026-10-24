import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormField } from '@angular/forms/signals';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserStore } from '../../../auth/services/user.store';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    TestBed.inject(UserStore).setUser({
      id: 'test-user', email: 'alex@example.com', firstName: 'Alex', gender: 'male',
      age: 28, height: 175, weight: 72.5, physicalActivityFactor: 1.55,
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates a numeric field and its interaction state through PrimeNG', async () => {
    const control = fixture.debugElement.queryAll(By.css('p-inputnumber'))[1];
    const input = control.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '178.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    const state = control.injector.get(FormField).field()();
    expect(state.value()).toBe(178.5);
    expect(state.dirty()).toBeTrue();
    expect(state.touched()).toBeTrue();
  });

  it('parses a birthday entered in the PrimeNG date picker', async () => {
    const control = fixture.debugElement.query(By.css('p-datepicker'));
    const input = control.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '1', code: 'Digit1' }));
    input.value = '15.06.1990';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    const value = control.injector.get(FormField).field()().value() as Date;
    expect(value.getFullYear()).toBe(1990);
    expect(value.getMonth()).toBe(5);
    expect(value.getDate()).toBe(15);
  });

  it('updates the gender when an option is selected in PrimeNG', async () => {
    const control = fixture.debugElement.query(By.css('p-select'));
    control.nativeElement.click();
    await fixture.whenStable();
    const option = fixture.nativeElement.querySelector('[role="option"]') as HTMLElement;
    expect(option).not.toBeNull();
    option.click();
    await fixture.whenStable();

    expect(control.injector.get(FormField).field()().value()).toBe('male');
  });

  it('loads saved activity and persists a change selected through PrimeNG', async () => {
    expect(component.profileModel().physicalActivityFactor).toBe(1.55);
    const control = fixture.debugElement.queryAll(By.css('p-select'))[1];
    control.nativeElement.click();
    await fixture.whenStable();
    const option = Array.from(fixture.nativeElement.querySelectorAll('[role="option"]'))
      .find((item) => (item as HTMLElement).textContent?.includes('Минимальная')) as HTMLElement;
    option.click();
    await fixture.whenStable();

    const event = new Event('submit', { bubbles: true, cancelable: true });
    fixture.nativeElement.querySelector('form').dispatchEvent(event);
    const request = TestBed.inject(HttpTestingController).expectOne('/profile/update');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.physicalActivityFactor).toBe(1.2);
    expect(component.loading()).toBeTrue();
    request.flush({ success: true, message: '' });
    await fixture.whenStable();

    expect(component.loading()).toBeFalse();
    expect(TestBed.inject(UserStore).user()?.physicalActivityFactor).toBe(1.2);
  });
});
