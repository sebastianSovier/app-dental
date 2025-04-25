import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamientoPageComponent } from './agendamiento-page.component';

describe('AgendamientoPageComponent', () => {
  let component: AgendamientoPageComponent;
  let fixture: ComponentFixture<AgendamientoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamientoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamientoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
