import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSaveDialogComponent } from './file-save-dialog.component';

describe('FileSaveDialogComponent', () => {
  let component: FileSaveDialogComponent;
  let fixture: ComponentFixture<FileSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
