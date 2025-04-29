import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientosConsultaPacienteComponent } from './tratamientos-consulta-paciente.component';

describe('TratamientosConsultaPacienteComponent', () => {
  let component: TratamientosConsultaPacienteComponent;
  let fixture: ComponentFixture<TratamientosConsultaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientosConsultaPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TratamientosConsultaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
