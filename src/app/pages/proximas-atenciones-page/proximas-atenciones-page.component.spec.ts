import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximasAtencionesPageComponent } from './proximas-atenciones-page.component';

describe('ProximasAtencionesPageComponent', () => {
  let component: ProximasAtencionesPageComponent;
  let fixture: ComponentFixture<ProximasAtencionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximasAtencionesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProximasAtencionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
