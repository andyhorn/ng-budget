import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurenceCardComponent } from './occurence-card.component';

describe('OccurenceCardComponent', () => {
  let component: OccurenceCardComponent;
  let fixture: ComponentFixture<OccurenceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurenceCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurenceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
