import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPerfilDialogComponent } from './modificar-perfil-dialog.component';

describe('ModificarPerfilDialogComponent', () => {
  let component: ModificarPerfilDialogComponent;
  let fixture: ComponentFixture<ModificarPerfilDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarPerfilDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPerfilDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
