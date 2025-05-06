import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivarPacienteDialogComponent } from './derivar-paciente-dialog.component';

describe('DerivarPacienteDialogComponent', () => {
  let component: DerivarPacienteDialogComponent;
  let fixture: ComponentFixture<DerivarPacienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerivarPacienteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DerivarPacienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
