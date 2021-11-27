import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { FileSaveDialogComponent } from './file-save-dialog.component';

describe('FileSaveDialogComponent', () => {
  let component: FileSaveDialogComponent;
  let fixture: ComponentFixture<FileSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FileSaveDialogComponent
      ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: function() {} }},
      ]
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

  it('should return a filename on save', () => {
    component.filename = 'Test';
    fixture.detectChanges();

    const ref = fixture.debugElement.injector.get(MatDialogRef);
    spyOn(ref, 'close').and.callFake((res) => {
      expect(res.toString()).toBeTruthy();
    });

    const button = fixture.debugElement.queryAll(By.css('button'))
      .find(e => e.nativeElement.innerText.includes('Save'));

    expect(button).toBeTruthy();
    button?.triggerEventHandler('click', {});
  });

  it('should return nothing on cancel', () => {
    const ref = fixture.debugElement.injector.get(MatDialogRef);
    spyOn(ref, 'close').and.callFake((res) => {
      expect(res).toBeFalsy();
    });

    const button = fixture.debugElement.queryAll(By.css('button'))
      .find(e => e.nativeElement.innerText.includes('Cancel'));

    expect(button).toBeTruthy();
    button?.triggerEventHandler('click', {});
  });

  it('should disable the save button if the field is empty', () => {
    const button = fixture.debugElement.queryAll(By.css('button'))
      .find(e => e.nativeElement.innerText.includes('Save'));

    expect(button?.nativeElement.disabled).toBeTruthy();
  });

  it('should enable the save button when text is entered in the field', () => {
    component.filename = 'Test';
    fixture.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('button'))
      .find(e => e.nativeElement.innerText.includes('Save'));

    expect(button?.nativeElement.disabled).toBeFalsy();
  });

  it('should contain a header about a filename', () => {
    const header = fixture.debugElement.query(By.css('h2'));
    expect(header.nativeElement.innerText.toLowerCase()).toContain('filename');
  });

  it('should contain a cancel button', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.find(b => b.nativeElement.innerText.includes('Cancel'))).toBeTruthy();
  });

  it('should contain a save button', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.find(b => b.nativeElement.innerText.includes('Save'))).toBeTruthy();
  });

  it('should contain a text field for the filename', () => {
    const field = fixture.debugElement.query(By.css('input'));
    expect(field).toBeTruthy();
  });
});
