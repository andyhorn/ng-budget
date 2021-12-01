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
    let data: any;
    component.filename = 'Test';
    fixture.detectChanges();

    const ref = fixture.debugElement.injector.get(MatDialogRef);
    spyOn(ref, 'close').and.callFake((res) => {
      data = res?.toString();
    });

    const button = fixture.debugElement.queryAll(By.css('button'))
      .find(e => e.nativeElement.innerText.includes('Save'));

    button?.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(data).toEqual('Test');
  });

  it('should return nothing on cancel', () => {
    const ref = fixture.debugElement.injector.get(MatDialogRef);
    let data: any = { test: 'there is test data here' };
    spyOn(ref, 'close').and.callFake((res) => {
      data = res;
    });

    const button = fixture.debugElement.queryAll(By.css('button'))
      .find(e => e.nativeElement.innerText.includes('Cancel'));

    button?.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(data).toBeFalsy();
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

  it('should trigger a save action when the enter key is pressed', () => {
    const ref = fixture.debugElement.injector.get(MatDialogRef);
    let data: any;
    spyOn(ref, 'close').and.callFake((res) => {
      data = res;
    });
    component.filename = 'test';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('keyup', { code: 'Enter' });
    fixture.detectChanges();
    expect(data).toBeTruthy();
  });
});
