import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAtencionesPageComponent } from './historial-atenciones-page.component';

describe('HistorialAtencionesPageComponent', () => {
  let component: HistorialAtencionesPageComponent;
  let fixture: ComponentFixture<HistorialAtencionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAtencionesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAtencionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
