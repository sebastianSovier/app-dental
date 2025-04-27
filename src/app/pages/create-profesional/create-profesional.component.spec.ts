import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfesionalComponent } from './create-profesional.component';

describe('CreateProfesionalComponent', () => {
  let component: CreateProfesionalComponent;
  let fixture: ComponentFixture<CreateProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProfesionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
