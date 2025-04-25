import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionDoctorPageComponent } from './evaluacion-doctor-page.component';

describe('EvaluacionDoctorPageComponent', () => {
  let component: EvaluacionDoctorPageComponent;
  let fixture: ComponentFixture<EvaluacionDoctorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionDoctorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionDoctorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
