import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reagentes } from './reagentes';

describe('Reagentes', () => {
  let component: Reagentes;
  let fixture: ComponentFixture<Reagentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reagentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reagentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
