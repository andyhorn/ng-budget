import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyDisplayComponent } from './frequency-display.component';

describe('FrequencyDisplayComponent', () => {
  let component: FrequencyDisplayComponent;
  let fixture: ComponentFixture<FrequencyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencyDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
