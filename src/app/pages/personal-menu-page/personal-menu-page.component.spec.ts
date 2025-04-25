import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalMenuPageComponent } from './personal-menu-page.component';

describe('PersonalMenuPageComponent', () => {
  let component: PersonalMenuPageComponent;
  let fixture: ComponentFixture<PersonalMenuPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalMenuPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalMenuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
