import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseProfileComponent } from './base-profile.component';

describe('BaseProfileComponent', () => {
  let component: BaseProfileComponent;
  let fixture: ComponentFixture<BaseProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
