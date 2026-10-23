import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormField } from '@angular/forms/signals';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
});
