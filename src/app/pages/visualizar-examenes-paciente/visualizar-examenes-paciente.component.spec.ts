import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarExamenesPacienteComponent } from './visualizar-examenes-paciente.component';

describe('VisualizarExamenesPacienteComponent', () => {
  let component: VisualizarExamenesPacienteComponent;
  let fixture: ComponentFixture<VisualizarExamenesPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarExamenesPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarExamenesPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
