import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaMedicaPageComponent } from './consulta-medica-page.component';

describe('ConsultaMedicaPageComponent', () => {
  let component: ConsultaMedicaPageComponent;
  let fixture: ComponentFixture<ConsultaMedicaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaMedicaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaMedicaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
