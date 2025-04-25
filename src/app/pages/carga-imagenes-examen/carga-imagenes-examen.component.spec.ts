import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaImagenesExamenComponent } from './carga-imagenes-examen.component';

describe('CargaImagenesExamenComponent', () => {
  let component: CargaImagenesExamenComponent;
  let fixture: ComponentFixture<CargaImagenesExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaImagenesExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaImagenesExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
