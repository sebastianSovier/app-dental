import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorPageComponent } from './administrador-page.component';

describe('AdministradorPageComponent', () => {
  let component: AdministradorPageComponent;
  let fixture: ComponentFixture<AdministradorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministradorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
