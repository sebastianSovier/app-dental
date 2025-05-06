import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAgendaProfesionalPageComponent } from './gestion-agenda-profesional-page.component';

describe('GestionAgendaProfesionalPageComponent', () => {
  let component: GestionAgendaProfesionalPageComponent;
  let fixture: ComponentFixture<GestionAgendaProfesionalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAgendaProfesionalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAgendaProfesionalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
